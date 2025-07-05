import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';
import { FlightsService } from '../flights/flights.service';
import { EmailService } from '../common/services/email.service';
import { 
  CreateBookingDto, 
  BookingDto, 
  BookingResponseDto, 
  UpdateBookingDto, 
  BookingStatus,
  PassengerDto 
} from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private supabaseService: SupabaseService,
    private flightsService: FlightsService,
    private emailService: EmailService,
  ) {}

  async createBooking(userId: string, createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
    const { flightId, passengers, cabinClass, returnFlightId, specialRequests } = createBookingDto;

    // Get flight details
    const flight = await this.flightsService.getFlightById(flightId);
    
    // Check if enough seats are available
    if (flight.availableSeats < passengers.length) {
      throw new BadRequestException('Not enough seats available');
    }

    // Calculate total price
    const totalPrice = flight.price * passengers.length;

    // Generate booking reference
    const bookingReference = this.generateBookingReference();

    // Create booking data
    const bookingData = {
      user_id: userId,
      flight_id: flightId,
      return_flight_id: returnFlightId || null,
      passengers: JSON.stringify(passengers),
      cabin_class: cabinClass,
      total_price: totalPrice,
      status: BookingStatus.PENDING,
      booking_reference: bookingReference,
      special_requests: specialRequests || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert booking into database
    const booking = await this.supabaseService.insert('bookings', bookingData);

    // Update available seats
    await this.flightsService.updateAvailableSeats(flightId, passengers.length);

    // Generate e-ticket
    const eTicket = this.generateETicket(booking.id);

    // Transform to DTO
    const bookingDto: BookingDto = {
      id: booking.id,
      userId: booking.user_id,
      flightId: booking.flight_id,
      returnFlightId: booking.return_flight_id,
      passengers: JSON.parse(booking.passengers),
      cabinClass: booking.cabin_class,
      totalPrice: booking.total_price,
      status: booking.status as BookingStatus,
      bookingReference: booking.booking_reference,
      specialRequests: booking.special_requests,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
    };

    // Send confirmation email
    try {
      const user = await this.supabaseService.query('users', { id: userId });
      if (user && user.length > 0) {
        await this.emailService.sendBookingConfirmation(user[0].email, bookingDto, eTicket);
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    return {
      booking: bookingDto,
      eTicket,
    };
  }

  async getBookingById(bookingId: string): Promise<BookingDto> {
    const bookings = await this.supabaseService.query('bookings', { id: bookingId });
    if (!bookings || bookings.length === 0) {
      throw new NotFoundException('Booking not found');
    }

    const booking = bookings[0];
    return {
      id: booking.id,
      userId: booking.user_id,
      flightId: booking.flight_id,
      returnFlightId: booking.return_flight_id,
      passengers: JSON.parse(booking.passengers),
      cabinClass: booking.cabin_class,
      totalPrice: booking.total_price,
      status: booking.status as BookingStatus,
      bookingReference: booking.booking_reference,
      specialRequests: booking.special_requests,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
    };
  }

  async updateBooking(bookingId: string, updateBookingDto: UpdateBookingDto): Promise<BookingDto> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updateBookingDto.status) updateData.status = updateBookingDto.status;
    if (updateBookingDto.specialRequests) updateData.special_requests = updateBookingDto.specialRequests;

    const updatedBooking = await this.supabaseService.update('bookings', bookingId, updateData);

    const bookingDto: BookingDto = {
      id: updatedBooking.id,
      userId: updatedBooking.user_id,
      flightId: updatedBooking.flight_id,
      returnFlightId: updatedBooking.return_flight_id,
      passengers: JSON.parse(updatedBooking.passengers),
      cabinClass: updatedBooking.cabin_class,
      totalPrice: updatedBooking.total_price,
      status: updatedBooking.status as BookingStatus,
      bookingReference: updatedBooking.booking_reference,
      specialRequests: updatedBooking.special_requests,
      createdAt: updatedBooking.created_at,
      updatedAt: updatedBooking.updated_at,
    };

    // Send update email
    try {
      const user = await this.supabaseService.query('users', { id: updatedBooking.user_id });
      if (user && user.length > 0) {
        await this.emailService.sendBookingUpdate(user[0].email, bookingDto);
      }
    } catch (error) {
      console.error('Failed to send update email:', error);
    }

    return bookingDto;
  }

  async cancelBooking(bookingId: string): Promise<BookingDto> {
    const booking = await this.getBookingById(bookingId);
    
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    // Update booking status to cancelled
    const updatedBooking = await this.updateBooking(bookingId, { status: BookingStatus.CANCELLED });

    // Return seats to flight
    await this.flightsService.updateAvailableSeats(booking.flightId, -booking.passengers.length);

    return updatedBooking;
  }

  async getUserBookings(userId: string): Promise<BookingDto[]> {
    const bookings = await this.supabaseService.query('bookings', { user_id: userId });
    
    return bookings.map((booking: any) => ({
      id: booking.id,
      userId: booking.user_id,
      flightId: booking.flight_id,
      returnFlightId: booking.return_flight_id,
      passengers: JSON.parse(booking.passengers),
      cabinClass: booking.cabin_class,
      totalPrice: booking.total_price,
      status: booking.status as BookingStatus,
      bookingReference: booking.booking_reference,
      specialRequests: booking.special_requests,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
    }));
  }

  private generateBookingReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateETicket(bookingId: string): string {
    return `ET-${bookingId.substring(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  }
} 