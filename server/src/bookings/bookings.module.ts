import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { SupabaseService } from '../config/supabase.service';
import { FlightsService } from '../flights/flights.service';
import { EmailService } from '../common/services/email.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, SupabaseService, FlightsService, EmailService],
  exports: [BookingsService],
})
export class BookingsModule {} 