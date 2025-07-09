import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingModal } from "./BookingModal";
import { FlightDto as OriginalFlightDto } from "@/hooks/useFlightSearch";

// Extend FlightDto to include airline_name (optional)
interface FlightDto extends OriginalFlightDto {
  airline_name?: string;
}

type Flight = FlightDto;

// Helper function to format duration from minutes to readable format
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Helper function to format time from ISO string
const formatTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

interface FlightResultsProps {
  results: Flight[];
  loading: boolean;
  passengers?: number;
  filters: {
    priceRange: [number, number];
    airlines: string[];
    departureTime?: string; // 'morning' | 'afternoon' | 'evening' | 'night' | undefined
    stops?: string[]; // ['nonstop', '1stop', '2stops']
  };
}

export const FlightResults = ({ results, loading, passengers = 1, filters }: FlightResultsProps) => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [sortType, setSortType] = useState<'price' | 'duration'>('price');

  // Helper to check stops
  const getStops = (flight: Flight) => {
    // For demo: always Nonstop, but you can add stops property to Flight if available
    // e.g., return flight.stops;
    return 'nonstop';
  };

  // Helper to check departure time window
  const isInDepartureWindow = (isoString: string, window?: string) => {
    if (!window) return true;
    const hour = new Date(isoString).getHours();
    if (window === 'morning') return hour >= 6 && hour < 12;
    if (window === 'afternoon') return hour >= 12 && hour < 18;
    if (window === 'evening') return hour >= 18 && hour < 24;
    if (window === 'night') return hour >= 0 && hour < 6;
    return true;
  };

  // Filtering logic
  let filteredResults = results.filter(flight => {
    // Price range
    // If priceRange is not set or covers all prices, do not filter by price
    if (
      Array.isArray(filters.priceRange) &&
      filters.priceRange.length === 2 &&
      (filters.priceRange[0] !== 0 || filters.priceRange[1] !==0)
    ) {
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) return false;
    }
    // Airlines
    if (filters.airlines && filters.airlines.length > 0 && !filters.airlines.includes(flight.airline_name || '')) return false;
    // Departure time
    if (!isInDepartureWindow(flight.departureTime, filters.departureTime)) return false;
    // Stops
    if (filters.stops && filters.stops.length > 0 && !filters.stops.includes(getStops(flight))) return false;
    return true;
  });

  // Sort flights based on sortType
  let sortedResults = [...filteredResults];
  if (sortType === 'price') {
    sortedResults.sort((a, b) => a.price - b.price);
  } else if (sortType === 'duration') {
    sortedResults.sort((a, b) => a.duration - b.duration);
  }

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

  if (sortedResults.length === 0) {
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
        <h2 className="text-2xl font-bold">{sortedResults.length} flights found</h2>
        <div className="flex gap-2">
          <Button 
            variant={sortType === 'price' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSortType(sortType === 'price' ? 'duration' : 'price')}
          >
            Sort by Price
          </Button>
          <Button 
            variant={sortType === 'duration' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSortType(sortType === 'duration' ? 'price' : 'duration')}
          >
            Sort by Duration
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedResults.map((flight) => (
          <Card  key={`${flight.id}-${flight.cabinClass}`} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-sm text-gray-600">{flight.airline_name || 'N/A'}</div>
                    <Badge variant="secondary">{flight.flightNumber}</Badge>
                    <Badge variant="outline">Nonstop</Badge>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatTime(flight.departureTime)}</div>
                      <div className="text-sm text-gray-600">{flight.origin}</div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(flight.duration)}</span>
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</div>
                      <div className="text-sm text-gray-600">{flight.destination}</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-8">
                  <div className="text-3xl font-bold text-blue-600">₹{flight.price}</div>
                  <div className="text-sm text-gray-600 mb-4">{flight.cabinClass}</div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setSelectedFlight(flight);
                      setIsBookingModalOpen(true);
                    }}
                  >
                    Select Flight
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <BookingModal
        flight={selectedFlight}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedFlight(null);
        }}
        passengers={passengers}
      />
    </div>
  );
};