import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateVideoLikeDto {
  @ApiProperty({ description: 'ID of the video to like', example: 1 })
  @IsNumber()
  videoId: number;
} 