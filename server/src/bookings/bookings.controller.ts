import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, BookingDto, BookingResponseDto, UpdateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async createBooking(
    @CurrentUser() user: any,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<ApiResponseDto<BookingResponseDto>> {
    const result = await this.bookingsService.createBooking(user.id, createBookingDto);
    return ApiResponseDto.success(result, 'Booking created successfully');
  }

  @Get()
  async getUserBookings(@CurrentUser() user: any): Promise<ApiResponseDto<BookingDto[]>> {
    const bookings = await this.bookingsService.getUserBookings(user.id);
    return ApiResponseDto.success(bookings, 'Bookings retrieved successfully');
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string): Promise<ApiResponseDto<BookingDto>> {
    const booking = await this.bookingsService.getBookingById(id);
    return ApiResponseDto.success(booking, 'Booking retrieved successfully');
  }

  @Put(':id')
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<ApiResponseDto<BookingDto>> {
    const booking = await this.bookingsService.updateBooking(id, updateBookingDto);
    return ApiResponseDto.success(booking, 'Booking updated successfully');
  }

  @Delete(':id')
  async cancelBooking(@Param('id') id: string): Promise<ApiResponseDto<BookingDto>> {
    const booking = await this.bookingsService.cancelBooking(id);
    return ApiResponseDto.success(booking, 'Booking cancelled successfully');
  }
} 