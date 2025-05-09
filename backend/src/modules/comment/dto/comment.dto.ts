import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Content of the comment', example: 'Great video!' })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @ApiProperty({ description: 'ID of the video', example: 1 })
  @IsNumber()
  videoId: number;

  @ApiProperty({ description: 'ID of the parent comment (for replies)', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  parentId?: number;
}

export class UpdateCommentDto {
  @ApiProperty({ description: 'New content of the comment', example: 'Updated comment' })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
} 