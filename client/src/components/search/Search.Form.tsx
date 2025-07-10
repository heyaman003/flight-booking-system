import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useAirportSearch, Airport } from "@/hooks/useAirports";

// Add frontend enum for cabin class to match backend
export enum CabinClass {
  ECONOMY = 'ECONOMY',
  PREMIUM_ECONOMY = 'PREMIUM_ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST',
}

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
    class: CabinClass.ECONOMY,
  });

  // Airport search hooks
  const { data: originAirports, isLoading: originLoading } = useAirportSearch(searchParams.origin);
  const { data: destinationAirports, isLoading: destinationLoading } = useAirportSearch(searchParams.destination);

  // Filter out the selected airport from the other field's suggestions
  const filteredOriginAirports = useMemo(() => {
    if (!originAirports) return [];
    return originAirports.filter(airport => 
      airport.code !== searchParams.destination && 
      airport.name !== searchParams.destination
    );
  }, [originAirports, searchParams.destination]);

  const filteredDestinationAirports = useMemo(() => {
    if (!destinationAirports) return [];
    return destinationAirports.filter(airport => 
      airport.code !== searchParams.origin && 
      airport.name !== searchParams.origin
    );
  }, [destinationAirports, searchParams.origin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchParams);
  };

  const handleOriginSelect = (airport: Airport) => {
    setSearchParams(prev => ({
      ...prev,
      origin: airport.code
    }));
  };

  const handleDestinationSelect = (airport: Airport) => {
    setSearchParams(prev => ({
      ...prev,
      destination: airport.code
    }));
  };

  const handleTripTypeChange = (type: string) => {
    setTripType(type);
    if (type === 'one-way') {
      setSearchParams(prev => ({ ...prev, returnDate: '' }));
    }
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
                onClick={() => handleTripTypeChange("round-trip")}
                className="flex-1"
              >
                Round Trip
              </Button>
              <Button
                type="button"
                variant={tripType === "one-way" ? "default" : "outline"}
                onClick={() => handleTripTypeChange("one-way")}
                className="flex-1"
              >
                One Way
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Autocomplete
                label="From"
                placeholder="Search airports (e.g., JFK, LAX)"
                value={searchParams.origin}
                onChange={(value) => setSearchParams({...searchParams, origin: value})}
                onSelect={handleOriginSelect}
                options={filteredOriginAirports}
                loading={originLoading}
                error={searchParams.origin && filteredOriginAirports.length === 0 ? 'No airports found' : undefined}
              />
              
              <Autocomplete
                label="To"
                placeholder="Search airports (e.g., JFK, LAX)"
                value={searchParams.destination}
                onChange={(value) => setSearchParams({...searchParams, destination: value})}
                onSelect={handleDestinationSelect}
                options={filteredDestinationAirports}
                loading={destinationLoading}
                error={searchParams.destination && filteredDestinationAirports.length === 0 ? 'No airports found' : undefined}
              />
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
                  disabled={tripType === 'one-way'}
                />
              </div>
              
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
                <Select value={searchParams.class} onValueChange={(value) => setSearchParams({...searchParams, class: value as CabinClass})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CabinClass.ECONOMY}>Economy</SelectItem>
                    <SelectItem value={CabinClass.PREMIUM_ECONOMY}>Premium Economy</SelectItem>
                    <SelectItem value={CabinClass.BUSINESS}>Business</SelectItem>
                    <SelectItem value={CabinClass.FIRST}>First Class</SelectItem>
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
