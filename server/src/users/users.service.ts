import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';
import { UpdateProfileDto, UserProfileDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async getProfile(userId: string): Promise<UserProfileDto> {
    const users = await this.supabaseService.query('users', { id: userId });
    if (!users || users.length === 0) {
      throw new NotFoundException('User not found');
    }

    const user = users[0];
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      postalCode: user.postal_code,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserProfileDto> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updateProfileDto.firstName) updateData.first_name = updateProfileDto.firstName;
    if (updateProfileDto.lastName) updateData.last_name = updateProfileDto.lastName;
    if (updateProfileDto.phone) updateData.phone = updateProfileDto.phone;
    if (updateProfileDto.address) updateData.address = updateProfileDto.address;
    if (updateProfileDto.city) updateData.city = updateProfileDto.city;
    if (updateProfileDto.country) updateData.country = updateProfileDto.country;
    if (updateProfileDto.postalCode) updateData.postal_code = updateProfileDto.postalCode;

    const updatedUser = await this.supabaseService.update('users', userId, updateData);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      country: updatedUser.country,
      postalCode: updatedUser.postal_code,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };
  }

  async getBookingHistory(userId: string) {
    const bookings = await this.supabaseService.query('bookings', { user_id: userId });
    return bookings || [];
  }
} 