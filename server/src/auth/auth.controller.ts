import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('health')
  healthCheck(): string {
    return 'Auth service is running';
  }
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.register(registerDto);
    return ApiResponseDto.success(result, 'User registered successfully');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.login(loginDto);
    return ApiResponseDto.success(result, 'Login successful');
  }
} 