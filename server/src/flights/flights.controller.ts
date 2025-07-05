import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightSearchDto, FlightDto, FlightSearchResponseDto } from './dto/flight.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('flights')
export class FlightsController {
  constructor(private flightsService: FlightsService) {}

  @Post('search')
  async searchFlights(@Body() searchDto: FlightSearchDto): Promise<ApiResponseDto<FlightSearchResponseDto>> {
    const result = await this.flightsService.searchFlights(searchDto);
    return ApiResponseDto.success(result, 'Flights found successfully');
  }

  @Get(':id')
  async getFlightById(@Param('id') id: string): Promise<ApiResponseDto<FlightDto>> {
    const flight = await this.flightsService.getFlightById(id);
    return ApiResponseDto.success(flight, 'Flight details retrieved successfully');
  }
} 