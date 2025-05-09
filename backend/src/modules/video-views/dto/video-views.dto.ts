import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateVideoViewDto {
  @ApiProperty({ description: 'ID of the video', example: 1 })
  @IsNumber()
  videoId: number;
} 