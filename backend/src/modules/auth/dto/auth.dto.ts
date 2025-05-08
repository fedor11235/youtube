import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'channel@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: 'Doe' })
  username: string;
}

export class LoginDto {
  @ApiProperty({ example: 'channel@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}