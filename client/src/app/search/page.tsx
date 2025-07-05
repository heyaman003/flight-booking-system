'use client';
import { useState } from "react";
import { SearchForm } from "@/components/search/Search.Form";
import { FlightResults } from "@/components/search/Flight.Results";
import { SearchFilters } from "@/components/search/Search.Filters";
type MockResult = {
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
};

const Page = () => {
  const [searchResults, setSearchResults] = useState<MockResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    airline: "",
    priceRange: [0, 2000],
    departure: "",
    duration: "",
  });

  const handleSearch = async (searchParams: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: "1",
          flightNumber: "UA1234",
          airline: "United Airlines",
          origin: "JFK",
          destination: "LAX",
          departureTime: "08:30",
          arrivalTime: "11:45",
          duration: "5h 15m",
          price: 299,
          class: "Economy",
          stops: 0,
        },
        {
          id: "2",
          flightNumber: "AA5678",
          airline: "American Airlines",
          origin: "JFK",
          destination: "LAX",
          departureTime: "14:20",
          arrivalTime: "17:30",
          duration: "5h 10m",
          price: 349,
          class: "Economy",
          stops: 0,
        },
        {
          id: "3",
          flightNumber: "DL9012",
          airline: "Delta Airlines",
          origin: "JFK",
          destination: "LAX",
          departureTime: "19:15",
          arrivalTime: "22:25",
          duration: "5h 10m",
          price: 279,
          class: "Economy",
          stops: 0,
        },
      ];
      setSearchResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} compact />
        </div>
        
        <div className="flex gap-8">
          <div className="w-1/4">
            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          </div>
          
          <div className="flex-1">
            <FlightResults results={searchResults} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;