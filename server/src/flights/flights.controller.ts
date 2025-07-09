import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { FlightsService } from './flights.service';
import {
  FlightSearchDto,
  FlightDto,
  FlightSearchResponseDto,
  FlightResultDto,
} from './dto/flight.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(private flightsService: FlightsService) {}

  @Post('search')
  @ApiOperation({ summary: 'Search for flights' })
  @ApiBody({ type: FlightSearchDto })
  @ApiResponse({
    status: 200,
    description: 'Flights found successfully',
    type: ApiResponseDto,
  })
  async searchFlights(
    @Body() searchDto: FlightSearchDto,
  ): Promise<ApiResponseDto<FlightSearchResponseDto>> {
    const result = await this.flightsService.searchFlights(searchDto);
    return ApiResponseDto.success(result, 'Flights found successfully');
  }
  @Get('all')
  @ApiOperation({ summary: 'Get all flights' })
  @ApiResponse({
    status: 200,
    description: 'Flights retrieved successfully',
    type: ApiResponseDto,
  })
  async getAllFlights(): Promise<ApiResponseDto<FlightDto[]>> {
    const flights = await this.flightsService.getAllFlights();
    return ApiResponseDto.success(flights, 'Flights retrieved successfully');
  }
  @Get('all-denormalized')
  @ApiOperation({ summary: 'Get all denormalized flights' })
  @ApiResponse({
    status: 200,
    description: 'Flights retrieved successfully',
    type: ApiResponseDto,
  })
  async getAllFlightsDenormalized(): Promise<
    ApiResponseDto<FlightResultDto[]>
  > {
    const flights = await this.flightsService.getAllFlightsDenormalized();
    return ApiResponseDto.success(flights, 'Flights retrieved successfully');
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get flight by ID' })
  @ApiParam({ name: 'id', description: 'Flight ID' })
  @ApiResponse({
    status: 200,
    description: 'Flight details retrieved successfully',
    type: ApiResponseDto,
  })
  async getFlightById(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<FlightDto>> {
    const flight = await this.flightsService.getFlightById(id);
    return ApiResponseDto.success(
      flight,
      'Flight details retrieved successfully',
    );
  }
}
