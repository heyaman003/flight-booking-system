import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/utils/fetch.utils';
import { API_CONFIG, buildApiUrl } from '@/config/api.config';
import { FALLBACK_AIRPORTS, searchAirportsLocally } from '@/data/airports';

export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface AirportSearchResponse {
  airports: Airport[];
  totalCount: number;
}

// Hook to fetch all airports for autocomplete
export const useAirports = () => {
  return useQuery({
    queryKey: ['airports'],
    queryFn: async (): Promise<Airport[]> => {
      const response = await fetchApi({
        url: buildApiUrl(API_CONFIG.ENDPOINTS.AIRPORTS),
        method: 'GET',
      });

      if (response.success && response.data) {
        return response.data.airports || response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch airports');
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Hook to search airports by query
export const useAirportSearch = (query: string) => {
  return useQuery({
    queryKey: ['airports', 'search', query],
    queryFn: async (): Promise<Airport[]> => {
      if (!query || query.length < 2) {
        return [];
      }

      try {
        const response = await fetchApi({
          url: buildApiUrl(API_CONFIG.ENDPOINTS.AIRPORTS_SEARCH(query)),
          method: 'GET',
        });

        if (response.success && response.data) {
          return response.data.airports || response.data;
        } else {
          throw new Error(response.message || 'Failed to search airports');
        }
      } catch (error) {
        console.warn('Airport API not available, using fallback data:', error);
        // Return fallback data if API is not available
        return searchAirportsLocally(query);
      }
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 