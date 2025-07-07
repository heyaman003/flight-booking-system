import { Controller, Post, Body, HttpCode, HttpStatus, Get, Headers, UseGuards, RawBodyRequest, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SupabaseService } from '../config/supabase.service';
import { MigrationService } from './migration.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiExtraModels(ApiResponseDto, AuthResponseDto)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private migrationService: MigrationService,
  ) {}
  
  @Get('health')
  @ApiOperation({ summary: 'Health check for auth service' })
  @ApiResponse({ status: 200, description: 'Auth service is running', type: String })
  healthCheck(): string {
    return 'Auth service is running';
  }
  
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: ApiResponseDto })
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.register(registerDto);
    return ApiResponseDto.success(result, 'User registered successfully');
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: ApiResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseDto<AuthResponseDto>> {
    console.log("--------------------------------",loginDto);
    const result = await this.authService.login(loginDto);
    return ApiResponseDto.success(result, 'Login successful');
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout the current user' })
  @ApiResponse({ status: 200, description: 'Logout successful', type: ApiResponseDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('authorization') authHeader: string): Promise<ApiResponseDto<{ success: boolean }>> {
    const token = authHeader?.replace('Bearer ', '');
    const result = await this.authService.logout(token);
    return ApiResponseDto.success(result, 'Logout successful');
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string', example: 'refresh.token.here' } } } })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully', type: ApiResponseDto })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: { refreshToken: string }): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.refreshToken(body.refreshToken);
    return ApiResponseDto.success(result, 'Token refreshed successfully');
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Supabase auth webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleAuthWebhook(@Req() request: RawBodyRequest<any>): Promise<{ success: boolean }> {
    try {
      const signature = request.headers['x-supabase-signature'];
      const body = request.body;

      // Verify webhook signature (you should implement this)
      // For now, we'll process the webhook without verification
      
      if (body.type === 'USER_CREATED') {
        const user = body.record;
        
        // Check if user profile already exists
        const existingProfiles = await this.supabaseService.query('users', { id: user.id });
        if (existingProfiles && existingProfiles.length > 0) {
          return { success: true }; // Profile already exists
        }

        // Create user profile in our users table
        await this.supabaseService.createUserProfile(user, {
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
          phone: user.user_metadata?.phone || null,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook processing failed:', error);
      return { success: false };
    }
  }

  // Migration endpoints (remove these after migration is complete)
  @Get('migration/status')
  @ApiOperation({ summary: 'Get migration status' })
  @ApiResponse({ status: 200, description: 'Migration status retrieved', type: ApiResponseDto })
  async getMigrationStatus(): Promise<ApiResponseDto<any>> {
    const status = await this.migrationService.getMigrationStatus();
    return ApiResponseDto.success(status, 'Migration status retrieved');
  }

  @Post('migration/run')
  @ApiOperation({ summary: 'Run user migration' })
  @ApiResponse({ status: 200, description: 'Migration completed', type: ApiResponseDto })
  async runMigration(): Promise<ApiResponseDto<any>> {
    const result = await this.migrationService.migrateExistingUsers();
    return ApiResponseDto.success(result, 'Migration completed');
  }

  @Post('migration/reset-password')
  @ApiOperation({ summary: 'Send password reset email to user' })
  @ApiBody({ schema: { properties: { email: { type: 'string', example: 'user@example.com' } } } })
  @ApiResponse({ status: 200, description: 'Password reset email sent', type: ApiResponseDto })
  async createPasswordReset(@Body() body: { email: string }): Promise<ApiResponseDto<any>> {
    const result = await this.migrationService.createPasswordReset(body.email);
    return ApiResponseDto.success(result, 'Password reset email sent');
  }
} 