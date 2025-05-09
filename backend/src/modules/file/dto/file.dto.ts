import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum FileType {
  VIDEO = 'VIDEO',
  PREVIEW = 'PREVIEW',
  AVATAR = 'AVATAR',
  BANNER = 'BANNER'
}

export class UploadFileDto {
  @ApiProperty({ 
    description: 'Type of the file',
    enum: FileType,
    example: FileType.VIDEO
  })
  @IsEnum(FileType)
  type: FileType;
} 