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

    // Fetch price for the selected flight and cabin class
    const priceResult = await this.supabaseService.query('flight_prices', {
      flight_id: flightId,
      cabin_class: cabinClass,
    });
    if (!priceResult || priceResult.length === 0) {
      throw new BadRequestException('No price found for this flight and cabin class');
    }
    const price = priceResult[0].price;

    // Fetch available seats for the selected flight and cabin class
    const seatResult = await this.supabaseService.query('flight_seats', {
      flight_id: flightId,
      cabin_class: cabinClass,
    });
    if (!seatResult || seatResult.length === 0) {
      throw new BadRequestException('No seat info found for this flight and cabin class');
    }
    const availableSeats = seatResult[0].available_seats;

    // Check if enough seats are available
    if (availableSeats < passengers.length) {
      throw new BadRequestException('Not enough seats available');
    }

    // Calculate total price
    const totalPrice = price * passengers.length;
  
    // Generate booking reference
    const bookingReference = this.generateBookingReference();

    // Create booking data (without passengers - they'll be stored separately)
    const bookingData = {
      user_id: userId,
      flight_id: flightId,
      return_flight_id: returnFlightId || null,
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

    // Insert passengers into passengers table
    const passengerPromises = passengers.map(passenger => {
      const passengerData = {
        booking_id: booking.id,
        first_name: passenger.firstName,
        last_name: passenger.lastName,
        date_of_birth: passenger.dateOfBirth,
        passport_number: passenger.passportNumber,
        nationality: passenger.nationality,
        aadhaar_number: passenger.aadhaarNumber || null,
        age: passenger.age || null,
        seat_number: passenger.seatNumber || null,
        special_requests: passenger.specialRequests || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return this.supabaseService.insert('passengers', passengerData);
    });

    await Promise.all(passengerPromises);

    // Update available seats in flight_seats table
    await this.supabaseService.updateWhere(
      'flight_seats',
      { flight_id: flightId, cabin_class: cabinClass },
      { available_seats: availableSeats - passengers.length }
    );

    // Generate e-ticket
    const eTicket = this.generateETicket(booking.id);

    // Get passengers for the response
    const storedPassengers = await this.supabaseService.query('passengers', { booking_id: booking.id });
    const passengersDto = this.mapPassengersToDto(storedPassengers);

    // Transform to DTO
    const bookingDto: BookingDto = {
      id: booking.id,
      userId: booking.user_id,
      flightId: booking.flight_id,
      returnFlightId: booking.return_flight_id,
      passengers: passengersDto,
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

    // Get passengers for this booking
    const passengers = await this.supabaseService.query('passengers', { booking_id: bookingId });
    const passengersDto = this.mapPassengersToDto(passengers);

    return {
      id: booking.id,
      userId: booking.user_id,
      flightId: booking.flight_id,
      returnFlightId: booking.return_flight_id,
      passengers: passengersDto,
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

    // Get passengers for this booking
    const passengers = await this.supabaseService.query('passengers', { booking_id: bookingId });
    const passengersDto = this.mapPassengersToDto(passengers);

    const bookingDto: BookingDto = {
      id: updatedBooking.id,
      userId: updatedBooking.user_id,
      flightId: updatedBooking.flight_id,
      returnFlightId: updatedBooking.return_flight_id,
      passengers: passengersDto,
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
    // console.log("booking found",booking)
    // Update booking status to cancelled
    const updatedBooking = await this.updateBooking(bookingId, { status: BookingStatus.CANCELLED });

    // Return seats to flight
    await this.flightsService.updateAvailableSeats(booking.flightId, -booking.passengers.length);

    return updatedBooking;
  }

  async getUserBookings(userId: string): Promise<BookingDto[]> {
    const bookings = await this.supabaseService.query('bookings', { user_id: userId });
    
    const bookingsWithPassengers = await Promise.all(
      bookings.map(async (booking: any) => {
        // Get passengers for this booking
        const passengers = await this.supabaseService.query('passengers', { booking_id: booking.id });
        const passengersDto = this.mapPassengersToDto(passengers);

        return {
          id: booking.id,
          userId: booking.user_id,
          flightId: booking.flight_id,
          returnFlightId: booking.return_flight_id,
          passengers: passengersDto,
          cabinClass: booking.cabin_class,
          totalPrice: booking.total_price,
          status: booking.status as BookingStatus,
          bookingReference: booking.booking_reference,
          specialRequests: booking.special_requests,
          createdAt: booking.created_at,
          updatedAt: booking.updated_at,
        };
      })
    );
    
    return bookingsWithPassengers;
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

  private mapPassengersToDto(passengers: any[]): PassengerDto[] {
    return passengers.map((p: any) => ({
      firstName: p.first_name,
      lastName: p.last_name,
      dateOfBirth: p.date_of_birth,
      passportNumber: p.passport_number,
      nationality: p.nationality,
      aadhaarNumber: p.aadhaar_number,
      age: p.age,
      seatNumber: p.seat_number,
      specialRequests: p.special_requests,
    }));
  }
} 