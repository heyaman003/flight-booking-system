'use client';
import { useState } from "react";
import { SearchForm } from "@/components/search/Search.Form";
import { FlightResults } from "@/components/search/Flight.Results";
import { SearchFilters } from "@/components/search/Search.Filters";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useFlightSearch, FlightSearchDto, FlightDto } from "@/hooks/useFlightSearch";

const Page = () => {
  const [searchParams, setSearchParams] = useState<FlightSearchDto | null>(null);
  const [filters, setFilters] = useState({
    airline: "",
    priceRange: [0, 2000],
    departure: "",
    duration: "",
  });

  // Use the flight search hook with caching
  const { data: searchData, isLoading, error } = useFlightSearch(searchParams);

  const handleSearch = async (searchData: any) => {
    // Transform the search form data to match the API format
    const apiSearchParams: FlightSearchDto = {
      origin: searchData.origin,
      destination: searchData.destination,
      departureDate: searchData.departureDate,
      returnDate: searchData.returnDate,
      passengers: parseInt(searchData.passengers) || 1,
      cabinClass: searchData.class || 'economy',
    };
    
    setSearchParams(apiSearchParams);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <SearchForm onSearch={handleSearch} compact />
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error loading flights: {error.message}</p>
            </div>
          )}
          
          <div className="flex gap-8">
            <div className="w-1/4">
              <SearchFilters filters={filters} onFiltersChange={setFilters} />
            </div>
            
            <div className="flex-1">
              <FlightResults 
                results={searchData?.flights || []} 
                loading={isLoading}
                passengers={searchParams?.passengers || 1}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;