import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateVideoHistoryDto {
  @ApiProperty({ description: 'ID of the video', example: 1 })
  @IsNumber()
  videoId: number;

  @ApiProperty({ description: 'Watch time in seconds', example: 120, required: false })
  @IsNumber()
  @IsOptional()
  watchTime?: number;
} 