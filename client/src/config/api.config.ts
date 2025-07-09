// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    
    // Flight endpoints
    FLIGHTS_SEARCH: '/api/flights/search',
    FLIGHT_BY_ID: (id: string) => `/api/flights/${id}`,
    
    // Airport endpoints
    AIRPORTS: '/api/airports',
    AIRPORTS_SEARCH: (query: string) => `/api/airports/search?q=${encodeURIComponent(query)}`,
    
    // Booking endpoints
    BOOKINGS: '/api/bookings',
    USER_BOOKINGS: '/api/bookings',
    BOOKING_BY_ID: (id: string) => `/api/bookings/${id}`,
    CANCEL_BOOKING: (id: string) => `/api/bookings/${id}`,
  },
  CACHE_TIMES: {
    FLIGHTS: 5 * 60 * 1000, // 5 minutes
    FLIGHT_DETAILS: 10 * 60 * 1000, // 10 minutes
    BOOKINGS: 2 * 60 * 1000, // 2 minutes
    BOOKING_DETAILS: 5 * 60 * 1000, // 5 minutes
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 