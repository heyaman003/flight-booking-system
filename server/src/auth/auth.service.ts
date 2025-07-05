import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../config/supabase.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../../node_modules/typeorm/browser/logger/Logger.d';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, phone } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.supabaseService.query('users', { email });
    if (existingUser && existingUser.length > 0) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Supabase
    const userData = {
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      created_at: new Date().toISOString(),
    };

    const user = await this.supabaseService.insert('users', userData);

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const users = await this.supabaseService.query('users', { email });
    if (!users || users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  }

  async validateUser(userId: string): Promise<any> {
    const users = await this.supabaseService.query('users', { id: userId });
    if (!users || users.length === 0) {
      return null;
    }
    return users[0];
  }
} 