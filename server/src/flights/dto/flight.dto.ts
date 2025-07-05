import { IsString, IsDateString, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum CabinClass {
  ECONOMY = 'economy',
  PREMIUM_ECONOMY = 'premium_economy',
  BUSINESS = 'business',
  FIRST = 'first',
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