import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/fetch.utils';
import { API_CONFIG, buildApiUrl } from '@/config/api.config';

// Types
export interface FlightSearchDto {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass?: string;
}

export interface FlightDto {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string; // Backend returns as ISO string
  arrivalTime: string; // Backend returns as ISO string
  duration: number; // Backend stores as minutes
  price: number;
  availableSeats: number;
  cabinClass: string; // Backend field name
  aircraft?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlightSearchResponseDto {
  flights: FlightDto[];
  totalCount: number;
  hasMore: boolean;
}

// Flight Search Hook
export const useFlightSearch = (searchParams: FlightSearchDto | null) => {
  return useQuery({
    queryKey: ['flights', 'search', searchParams],
    queryFn: async (): Promise<FlightSearchResponseDto> => {
      if (!searchParams) {
        throw new Error('Search parameters are required');
      }

      console.log('Searching flights with params:', searchParams);

      const response = await fetchApi({
        url: buildApiUrl(API_CONFIG.ENDPOINTS.FLIGHTS_SEARCH),
        method: 'POST',
        data: searchParams,
      });

      console.log('Flight search response:', response);

      // Handle the API response format
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to search flights');
      }
    },
    enabled: !!searchParams,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Flight by ID Hook
export const useFlightById = (flightId: string | null) => {
  return useQuery({
    queryKey: ['flights', flightId],
    queryFn: async (): Promise<FlightDto> => {
      if (!flightId) {
        throw new Error('Flight ID is required');
      }

      const response = await fetchApi({
        url: buildApiUrl(API_CONFIG.ENDPOINTS.FLIGHT_BY_ID(flightId)),
        method: 'GET',
      });

      // Handle the API response format
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get flight details');
      }
    },
    enabled: !!flightId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}; 