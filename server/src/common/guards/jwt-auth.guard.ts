import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common';
import { SupabaseService } from '../../config/supabase.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const user = await this.supabaseService.getUser(token);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Get user profile from our users table
      const userProfiles = await this.supabaseService.query('users', { id: user.id });
      const userProfile = userProfiles?.[0];

      // Attach user to request
      request.user = {
        ...user,
        profile: userProfile,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 