import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  BookingDto,
  BookingResponseDto,
  UpdateBookingDto,
} from './dto/booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: ApiResponseDto,
  })
  async createBooking(
    @CurrentUser() user: any,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<ApiResponseDto<BookingResponseDto>> {
    const result = await this.bookingsService.createBooking(
      user.id,
      createBookingDto,
    );
    return ApiResponseDto.success(result, 'Booking created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    type: ApiResponseDto,
  })
  async getUserBookings(
    @CurrentUser() user: any,
  ): Promise<ApiResponseDto<BookingDto[]>> {
    const bookings = await this.bookingsService.getUserBookings(user.id);
    return ApiResponseDto.success(bookings, 'Bookings retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking retrieved successfully',
    type: ApiResponseDto,
  })
  async getBookingById(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<BookingDto>> {
    const booking = await this.bookingsService.getBookingById(id);
    return ApiResponseDto.success(booking, 'Booking retrieved successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiBody({ type: UpdateBookingDto })
  @ApiResponse({
    status: 200,
    description: 'Booking updated successfully',
    type: ApiResponseDto,
  })
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<ApiResponseDto<BookingDto>> {
    const booking = await this.bookingsService.updateBooking(
      id,
      updateBookingDto,
    );
    return ApiResponseDto.success(booking, 'Booking updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    type: ApiResponseDto,
  })
  async cancelBooking(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<BookingDto>> {
    const booking = await this.bookingsService.cancelBooking(id);
    console.log("booking response ",booking)
    return ApiResponseDto.success(booking, 'Booking cancelled successfully');
  }
}
