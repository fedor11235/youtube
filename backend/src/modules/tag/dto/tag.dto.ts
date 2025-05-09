import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, MinLength, MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Name of the tag', example: 'gaming' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}

export class CreateVideoTagsDto {
  @ApiProperty({ description: 'Array of tag names', example: ['gaming', 'funny'] })
  @IsArray()
  @IsString({ each: true })
  @MinLength(2, { each: true })
  @MaxLength(50, { each: true })
  tags: string[];
} 