import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FlightsModule } from './flights/flights.module';
import { BookingsModule } from './bookings/bookings.module';
import { SupabaseService } from './config/supabase.service';
import { EmailService } from './common/services/email.service';
import { SseService } from './common/services/sse.service';
import { SseController } from './common/controllers/sse.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    FlightsModule,
    BookingsModule,
  ],
  controllers: [AppController, SseController],
  providers: [AppService, SupabaseService, EmailService, SseService],
})
export class AppModule {}
