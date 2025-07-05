import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  class: string;
  stops: number;
}

interface FlightResultsProps {
  results: Flight[];
  loading: boolean;
}

export const FlightResults = ({ results, loading }: FlightResultsProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Plane className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No flights found</h3>
        <p className="text-gray-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{results.length} flights found</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Sort by Price</Button>
          <Button variant="outline" size="sm">Sort by Duration</Button>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((flight) => (
          <Card key={flight.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-sm text-gray-600">{flight.airline}</div>
                    <Badge variant="secondary">{flight.flightNumber}</Badge>
                    {flight.stops === 0 && <Badge variant="outline">Nonstop</Badge>}
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{flight.departureTime}</div>
                      <div className="text-sm text-gray-600">{flight.origin}</div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <Clock className="h-4 w-4" />
                        <span>{flight.duration}</span>
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold">{flight.arrivalTime}</div>
                      <div className="text-sm text-gray-600">{flight.destination}</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-8">
                  <div className="text-3xl font-bold text-blue-600">${flight.price}</div>
                  <div className="text-sm text-gray-600 mb-4">{flight.class}</div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Select Flight
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
