import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, IsUrl } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Username', example: 'johndoe' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  password: string;
}

export class UpdateChannelDto {
  @ApiPropertyOptional({ description: 'Username', example: 'johndoe' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @ApiPropertyOptional({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg' })
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ description: 'Banner URL', example: 'https://example.com/banner.jpg' })
  @IsUrl()
  @IsOptional()
  banner?: string;
} 