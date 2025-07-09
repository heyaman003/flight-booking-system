import { IsString, IsDateString, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum CabinClass {
  ECONOMY = 'ECONOMY',
  PREMIUM_ECONOMY = 'PREMIUM_ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST',
}

export enum TripType {
  ONE_WAY = 'one_way',
  ROUND_TRIP = 'round_trip',
}

export class FlightSearchDto {
  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsDateString()
  departureDate: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(9)
  adults: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9)
  children: number = 0;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9)
  infants: number = 0;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(9)
  passengers: number = 1; // <-- Add this line
  
  @IsEnum(CabinClass)
  cabinClass: CabinClass = CabinClass.ECONOMY;

  @IsEnum(TripType)
  tripType: TripType = TripType.ONE_WAY;
}

export class FlightDto {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  price: number;
  availableSeats: number;
  cabinClass: CabinClass;
  aircraft: string;
  status: string;
}

export class FlightSearchResponseDto {
  flights: FlightDto[];
  total: number;
  searchCriteria: FlightSearchDto;
} 

export class FlightResultDto {
  id: string;
  flightNumber: string;
  airline: { id: string; name: string };
  origin: { id: string; code: string; name: string; city: string; country: string };
  destination: { id: string; code: string; name: string; city: string; country: string };
  departureTime: string;
  arrivalTime: string;
  duration: number;
  aircraft: { id: string; name: string; model: string; manufacturer: string };
  status: string;
  price: number;
  cabinClass: string;
  availableSeats: number;
}