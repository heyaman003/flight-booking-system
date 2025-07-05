import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  onSearch?: (params: any) => void;
  compact?: boolean;
}

export const SearchForm = ({ onSearch, compact = false }: SearchFormProps) => {
  const [tripType, setTripType] = useState("round-trip");
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
    class: "economy",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchParams);
  };

  return (
    <Card className={cn("w-full", compact ? "shadow-md" : "shadow-xl")}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {!compact && (
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={tripType === "round-trip" ? "default" : "outline"}
                onClick={() => setTripType("round-trip")}
                className="flex-1"
              >
                Round Trip
              </Button>
              <Button
                type="button"
                variant={tripType === "one-way" ? "default" : "outline"}
                onClick={() => setTripType("one-way")}
                className="flex-1"
              >
                One Way
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  From
                </Label>
                <Input
                  id="origin"
                  placeholder="New York (JFK)"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  To
                </Label>
                <Input
                  id="destination"
                  placeholder="Los Angeles (LAX)"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Departure
                </Label>
                <Input
                  id="departure"
                  type="date"
                  value={searchParams.departureDate}
                  onChange={(e) => setSearchParams({...searchParams, departureDate: e.target.value})}
                />
              </div>
              
              {(tripType === "round-trip" || !compact) && (
                <div className="space-y-2">
                  <Label htmlFor="return" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Return
                  </Label>
                  <Input
                    id="return"
                    type="date"
                    value={searchParams.returnDate}
                    onChange={(e) => setSearchParams({...searchParams, returnDate: e.target.value})}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Passengers
                </Label>
                <Select value={searchParams.passengers} onValueChange={(value) => setSearchParams({...searchParams, passengers: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Passenger</SelectItem>
                    <SelectItem value="2">2 Passengers</SelectItem>
                    <SelectItem value="3">3 Passengers</SelectItem>
                    <SelectItem value="4">4 Passengers</SelectItem>
                    <SelectItem value="5+">5+ Passengers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={searchParams.class} onValueChange={(value) => setSearchParams({...searchParams, class: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium-economy">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plane className="h-4 w-4 mr-2" />
                  Search Flights
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
