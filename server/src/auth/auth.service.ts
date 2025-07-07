import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private supabaseService: SupabaseService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, phone } = registerDto;
    this.logger.log('Registering user:', email);
    try {
      // Check if user already exists in our users table
      const existingUsers = await this.supabaseService.query('users', { email });
      if (existingUsers && existingUsers.length > 0) {
        throw new ConflictException('User already exists');
      }

      // Create user in Supabase Auth
      const userData = {
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
      };

      const { user, session } = await this.supabaseService.signUp(email, password, userData);
      
      if (!user) {
        throw new InternalServerErrorException('Failed to create user');
      }

      // Create user profile in our users table
      const userProfile = await this.supabaseService.createUserProfile(user, {
        firstName,
        lastName,
        phone,
      });

      return {
        accessToken: session?.access_token,
        refreshToken: session?.refresh_token,
        user: {
          id: user.id,
          email: user.email,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
        },
      };
    } catch (error) {
      this.logger.error('Registration failed:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    console.log("--------------------------------",loginDto);
    try {
      const { email, password } = loginDto;

      // Authenticate with Supabase
      const { user, session } = await this.supabaseService.signIn(email, password);
      
      if (!user || !session) {
        throw new UnauthorizedException('Invalid credentials');
      }
     console.log("--------------------------------",user);
      // Get user profile from our users table
      const userProfiles = await this.supabaseService.query('users', { id: user.id });
      const userProfile = userProfiles?.[0];

      return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        user: {
          id: user.id,
          email: user.email,
          firstName: userProfile?.first_name || user.user_metadata?.first_name || '',
          lastName: userProfile?.last_name || user.user_metadata?.last_name || '',
        },
      };
    } catch (error) {
      this.logger.error('Login failed:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async logout(token: string): Promise<{ success: boolean }> {
    try {
      await this.supabaseService.signOut();
      return { success: true };
    } catch (error) {
      this.logger.error('Logout failed:', error);
      throw new InternalServerErrorException('Logout failed');
    }
  }

  async validateUser(token: string): Promise<any> {
    try {
      const user = await this.supabaseService.getUser(token);
      if (!user) {
        return null;
      }

      // Get user profile from our users table
      const userProfiles = await this.supabaseService.query('users', { id: user.id });
      const userProfile = userProfiles?.[0];

      return {
        ...user,
        profile: userProfile,
      };
    } catch (error) {
      this.logger.error('User validation failed:', error);
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const { session } = await this.supabaseService.refreshToken(refreshToken);
      
      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user profile
      const userProfiles = await this.supabaseService.query('users', { id: session.user.id });
      const userProfile = userProfiles?.[0];

      return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        user: {
          id: session.user.id,
          email: session.user.email,
          firstName: userProfile?.first_name || session.user.user_metadata?.first_name || '',
          lastName: userProfile?.last_name || session.user.user_metadata?.last_name || '',
        },
      };
    } catch (error) {
      this.logger.error('Token refresh failed:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
} 