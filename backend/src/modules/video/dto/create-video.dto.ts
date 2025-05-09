import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, IsArray, IsNumber } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ description: 'Title of the video', example: 'My Awesome Video' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Description of the video', example: 'This is a great video about...', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ description: 'Array of tag names', example: ['gaming', 'funny'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Duration of the video in seconds', example: 120, required: false })
  @IsNumber()
  @IsOptional()
  duration?: number;
}

export class UpdateVideoDto {
  @ApiPropertyOptional({ description: 'Title of the video', example: 'Updated Video Title' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ description: 'Description of the video', example: 'Updated description...' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ description: 'Array of tag names', example: ['gaming', 'funny'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}