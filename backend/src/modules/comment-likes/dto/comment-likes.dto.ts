import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateCommentLikeDto {
  @ApiProperty({ description: 'ID of the comment to like', example: 1 })
  @IsNumber()
  commentId: number;
} 