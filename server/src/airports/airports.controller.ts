import { Controller, Get, Query } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Airports')
@Controller('airports')
export class AirportsController {
  constructor(private supabaseService: SupabaseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all airports' })
  @ApiResponse({ status: 200, description: 'List of all airports' })
  async getAllAirports() {
    // Return all airports (id, code, name, city, country)
    const airports = await this.supabaseService.query('airports', {});
    return airports.map((a: any) => ({
      id: a.id,
      code: a.iata_code,
      name: a.name,
      city: a.city,
      country: a.country,
    }));
  }

  @Get('search')
  @ApiOperation({ summary: 'Search airports by query' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search term (IATA code, name, or city)',
  })
  @ApiResponse({ status: 200, description: 'Search results for airports' })
  async searchAirports(@Query('q') q: string) {
    if (!q) return [];
    // Search by IATA code or name (case-insensitive)
    const airports = await this.supabaseService.query('airports', {});
    console.log(airports);
    const qLower = q.toLowerCase();
    let data = airports
      .filter(
        (a: any) =>
          a.iata_code.toLowerCase().includes(qLower) ||
          a.name.toLowerCase().includes(qLower) ||
          a.city.toLowerCase().includes(qLower),
      )
      .map((a: any) => ({
        id: a.id,
        code: a.iata_code,
        name: a.name,
        city: a.city,
        country: a.country,
      }));
    return { data, success: true };
  }
}
