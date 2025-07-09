import { Module } from '@nestjs/common';
import { AirportsController } from './airports.controller';
import { SupabaseService } from '../config/supabase.service';

@Module({
  controllers: [AirportsController],
  providers: [SupabaseService],
})
export class AirportsModule {} 