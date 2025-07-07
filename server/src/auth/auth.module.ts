import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MigrationService } from './migration.service';
import { SupabaseService } from '../config/supabase.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MigrationService, SupabaseService],
  exports: [AuthService],
})
export class AuthModule {} 