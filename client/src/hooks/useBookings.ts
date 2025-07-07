import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/fetch.utils';
import { API_CONFIG, buildApiUrl } from '@/config/api.config';

// Types
export interface PassengerDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber?: string;
  nationality: string;
}

export interface CreateBookingDto {
  flightId: string;
  passengers: PassengerDto[];
  cabinClass: string;
  returnFlightId?: string;
  specialRequests?: string;
}

export interface BookingDto {
  id: string;
  userId: string;
  flightId: string;
  returnFlightId?: string;
  passengers: PassengerDto[];
  cabinClass: string;
  totalPrice: number;
  status: string;
  bookingReference: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingResponseDto {
  booking: BookingDto;
  eTicket: string;
}

// Create Booking Hook
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: CreateBookingDto): Promise<BookingResponseDto> => {
      const response = await fetchApi({
        url: buildApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS),
        method: 'POST',
        data: bookingData,
      });

      // Handle the API response format
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch user bookings
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user'] });
    },
  });
};

// Get User Bookings Hook
export const useUserBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'user'],
    queryFn: async (): Promise<BookingDto[]> => {
      const response = await fetchApi({
        url: buildApiUrl(API_CONFIG.ENDPOINTS.USER_BOOKINGS),
        method: 'GET',
      });

      // Handle the API response format
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch user bookings');
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Booking by ID Hook
export const useBookingById = (bookingId: string | null) => {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: async (): Promise<BookingDto> => {
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }

      const response = await fetchApi({
        url: buildApiUrl(API_CONFIG.ENDPOINTS.BOOKING_BY_ID(bookingId)),
        method: 'GET',
      });

      // Handle the API response format
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get booking details');
      }
    },
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Cancel Booking Hook
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string): Promise<BookingDto> => {
      const response = await fetchApi({
        url: buildApiUrl(API_CONFIG.ENDPOINTS.CANCEL_BOOKING(bookingId)),
        method: 'POST',
      });

      // Handle the API response format
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to cancel booking');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch user bookings
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user'] });
    },
  });
}; 