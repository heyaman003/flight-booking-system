import { IsString, IsNumber, IsArray, IsEnum, IsOptional, ValidateNested, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CabinClass } from '../../flights/dto/flight.dto';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export class PassengerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  passportNumber: string;

  @IsString()
  nationality: string;

  @IsOptional()
  @IsString()
  aadhaarNumber?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsString()
  seatNumber?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}

export class CreateBookingDto {
  @IsString()
  flightId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[];

  @IsEnum(CabinClass)
  cabinClass: CabinClass;

  @IsOptional()
  @IsString()
  returnFlightId?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}

export class BookingDto {
  id: string;
  userId: string;
  flightId: string;
  returnFlightId?: string;
  passengers: PassengerDto[];
  cabinClass: CabinClass;
  totalPrice: number;
  status: BookingStatus;
  bookingReference: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export class BookingResponseDto {
  booking: BookingDto;
  eTicket: string;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  specialRequests?: string;
} 