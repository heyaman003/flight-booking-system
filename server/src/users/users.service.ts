import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';
import { UpdateProfileDto, UserProfileDto } from './dto/user.dto';
import {ChangePasswordDto} from './dto/user.dto';
import { createClient } from '@supabase/supabase-js';

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

// Change password
async changePassword(userId: string, dto: ChangePasswordDto, accessToken: string,refreshToken: string) {
  // 1. Get user email from your users table
  const user = await this.supabaseService.query('users', { id: userId });
  if (!user || !user[0]) throw new Error('User not found');
  const email = user[0].email;

  // 2. Re-authenticate user with current password
  try {
    await this.supabaseService.signIn(email, dto.currentPassword);
  } catch {
    throw new Error('Current password is incorrect');
  }
  // console.log("--------------------------------",accessToken,refreshToken);
  // 3. Create a Supabase client for this session
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
  await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

  // 4. Update password
  const { error } = await supabase.auth.updateUser({ password: dto.newPassword });
  if (error) throw error;
  return { success: true };
}
  async getBookingHistory(userId: string) {
    const bookings = await this.supabaseService.query('bookings', { user_id: userId });
    return bookings || [];
  }
} 