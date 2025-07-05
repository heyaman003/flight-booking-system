import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { SupabaseService } from '../config/supabase.service';

@Module({
  controllers: [FlightsController],
  providers: [FlightsService, SupabaseService],
  exports: [FlightsService],
})
export class FlightsModule {} 