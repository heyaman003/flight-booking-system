import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6, description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6, description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+1234567890', required: false, description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class AuthResponseUserDto {
  @ApiProperty({ example: 'uuid' })
  id: string;
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  @ApiProperty({ example: 'John' })
  firstName: string;
  @ApiProperty({ example: 'Doe' })
  lastName: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'jwt.token.here' })
  accessToken: string;

  @ApiProperty({ example: 'refresh.token.here', required: false })
  refreshToken?: string;

  @ApiProperty({ type: AuthResponseUserDto })
  user: AuthResponseUserDto;
} 