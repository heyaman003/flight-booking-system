import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';
import { FlightSearchDto, FlightDto, FlightSearchResponseDto, CabinClass } from './dto/flight.dto';

@Injectable()
export class FlightsService {
  constructor(private supabaseService: SupabaseService) {}

  async searchFlights(searchDto: FlightSearchDto): Promise<FlightSearchResponseDto> {
    const { origin, destination, departureDate, cabinClass } = searchDto;

    // Build query for flights
    let query = {
      origin,
      destination,
      cabin_class: cabinClass,
    };

    // Add date filter
    const departureDateObj = new Date(departureDate);
    const startOfDay = new Date(departureDateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(departureDateObj);
    endOfDay.setHours(23, 59, 59, 999);

    // Get flights from database
    const flights = await this.supabaseService.query('flights', query);
    
    // Filter flights by date and available seats
    const filteredFlights = flights.filter((flight: any) => {
      const flightDate = new Date(flight.departure_time);
      const isDateMatch = flightDate >= startOfDay && flightDate <= endOfDay;
      const hasAvailableSeats = flight.available_seats > 0;
      return isDateMatch && hasAvailableSeats;
    });

    // Transform to DTO format
    const flightDtos: FlightDto[] = filteredFlights.map((flight: any) => ({
      id: flight.id,
      flightNumber: flight.flight_number,
      airline: flight.airline,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      duration: flight.duration,
      price: flight.price,
      availableSeats: flight.available_seats,
      cabinClass: flight.cabin_class as CabinClass,
      aircraft: flight.aircraft,
      status: flight.status,
    }));

    return {
      flights: flightDtos,
      total: flightDtos.length,
      searchCriteria: searchDto,
    };
  }

  async getFlightById(flightId: string): Promise<FlightDto> {
    const flights = await this.supabaseService.query('flights', { id: flightId });
    if (!flights || flights.length === 0) {
      throw new Error('Flight not found');
    }

    const flight = flights[0];
    return {
      id: flight.id,
      flightNumber: flight.flight_number,
      airline: flight.airline,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      duration: flight.duration,
      price: flight.price,
      availableSeats: flight.available_seats,
      cabinClass: flight.cabin_class as CabinClass,
      aircraft: flight.aircraft,
      status: flight.status,
    };
  }

  async updateFlightStatus(flightId: string, status: string): Promise<void> {
    await this.supabaseService.update('flights', flightId, { status });
  }

  async updateAvailableSeats(flightId: string, seatsToReduce: number): Promise<void> {
    const flights = await this.supabaseService.query('flights', { id: flightId });
    if (!flights || flights.length === 0) {
      throw new Error('Flight not found');
    }

    const flight = flights[0];
    const newAvailableSeats = Math.max(0, flight.available_seats - seatsToReduce);
    
    await this.supabaseService.update('flights', flightId, {
      available_seats: newAvailableSeats,
    });
  }
  async getAllFlights(): Promise<FlightDto[]> {
    const flights = await this.supabaseService.query('flights', {});
    return flights.map((flight: any) => ({
      id: flight.id,
      flightNumber: flight.flight_number,
      airline: flight.airline,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      duration: flight.duration,
      price: flight.price,
      availableSeats: flight.available_seats,
      cabinClass: flight.cabin_class,
      aircraft: flight.aircraft,
      status: flight.status,
    }));
  }
} 