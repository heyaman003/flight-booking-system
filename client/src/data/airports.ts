import { Airport } from '@/hooks/useAirports';

// Fallback airport data for testing
export const FALLBACK_AIRPORTS: Airport[] = [
  {
    id: '1',
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'United States',
    latitude: 40.6413,
    longitude: -73.7781,
  },
  {
    id: '2',
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'United States',
    latitude: 33.9416,
    longitude: -118.4085,
  },
  {
    id: '3',
    code: 'ORD',
    name: 'O\'Hare International Airport',
    city: 'Chicago',
    country: 'United States',
    latitude: 41.9786,
    longitude: -87.9048,
  },
  {
    id: '4',
    code: 'ATL',
    name: 'Hartsfield-Jackson Atlanta International Airport',
    city: 'Atlanta',
    country: 'United States',
    latitude: 33.6407,
    longitude: -84.4277,
  },
  {
    id: '5',
    code: 'DFW',
    name: 'Dallas/Fort Worth International Airport',
    city: 'Dallas',
    country: 'United States',
    latitude: 32.8968,
    longitude: -97.0380,
  },
  {
    id: '6',
    code: 'DEN',
    name: 'Denver International Airport',
    city: 'Denver',
    country: 'United States',
    latitude: 39.8561,
    longitude: -104.6737,
  },
  {
    id: '7',
    code: 'SFO',
    name: 'San Francisco International Airport',
    city: 'San Francisco',
    country: 'United States',
    latitude: 37.6213,
    longitude: -122.3790,
  },
  {
    id: '8',
    code: 'MIA',
    name: 'Miami International Airport',
    city: 'Miami',
    country: 'United States',
    latitude: 25.7932,
    longitude: -80.2906,
  },
  {
    id: '9',
    code: 'LHR',
    name: 'London Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    latitude: 51.4700,
    longitude: -0.4543,
  },
  {
    id: '10',
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
    latitude: 49.0097,
    longitude: 2.5479,
  },
  {
    id: '11',
    code: 'FRA',
    name: 'Frankfurt Airport',
    city: 'Frankfurt',
    country: 'Germany',
    latitude: 50.0379,
    longitude: 8.5622,
  },
  {
    id: '12',
    code: 'AMS',
    name: 'Amsterdam Airport Schiphol',
    city: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.3105,
    longitude: 4.7683,
  },
  {
    id: '13',
    code: 'NRT',
    name: 'Narita International Airport',
    city: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 140.0173,
  },
  {
    id: '14',
    code: 'HKG',
    name: 'Hong Kong International Airport',
    city: 'Hong Kong',
    country: 'China',
    latitude: 22.3080,
    longitude: 113.9185,
  },
  {
    id: '15',
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    latitude: 1.3644,
    longitude: 103.9915,
  },
];

// Helper function to search airports locally
export const searchAirportsLocally = (query: string): Airport[] => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return FALLBACK_AIRPORTS.filter(airport => 
    airport.code.toLowerCase().includes(lowerQuery) ||
    airport.name.toLowerCase().includes(lowerQuery) ||
    airport.city.toLowerCase().includes(lowerQuery) ||
    airport.country.toLowerCase().includes(lowerQuery)
  );
}; 