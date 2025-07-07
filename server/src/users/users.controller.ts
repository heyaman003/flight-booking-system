import { Controller, Get, Put, Body, UseGuards, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto, UserProfileDto } from './dto/user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {ChangePasswordDto} from './dto/user.dto';
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any): Promise<ApiResponseDto<UserProfileDto>> {
    const profile = await this.usersService.getProfile(user.id);
    return ApiResponseDto.success(profile, 'Profile retrieved successfully');
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ApiResponseDto<UserProfileDto>> {
    const profile = await this.usersService.updateProfile(user.id, updateProfileDto);
    return ApiResponseDto.success(profile, 'Profile updated successfully');
  }

  @Get('bookings')
  async getBookingHistory(@CurrentUser() user: any): Promise<ApiResponseDto<any[]>> {
    const bookings = await this.usersService.getBookingHistory(user.id);
    return ApiResponseDto.success(bookings, 'Booking history retrieved successfully');
  }
  
@Post('change-password')
@ApiBearerAuth()
@ApiOperation({ summary: 'Change user password' })
@ApiBody({ type: ChangePasswordDto })
@ApiResponse({ status: 200, description: 'Password changed', type: ApiResponseDto })
async changePassword(
  @Body() dto: ChangePasswordDto,
  @Req() req: Request
): Promise<ApiResponseDto<any>> {
  const userId = req['user']?.id;
  const accessToken = req.headers['authorization']?.replace('Bearer ', '');
  const refreshToken = req.headers['x-refresh-token'] as string;
  // console.log("--------------------------------",refreshToken);
  await this.usersService.changePassword(userId, dto, accessToken,refreshToken);
  return ApiResponseDto.success(null, 'Password changed');
}
} 