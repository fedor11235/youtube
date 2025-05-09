import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsObject, IsOptional } from 'class-validator';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  SUBSCRIPTION = 'subscription',
  SYSTEM = 'system'
}

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID of the channel to notify', example: 1 })
  @IsString()
  channelId: number;

  @ApiProperty({ description: 'Title of the notification', example: 'New like' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Message content', example: 'Someone liked your video!' })
  @IsString()
  message: string;

  @ApiProperty({ 
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.LIKE
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ 
    description: 'Additional data for the notification',
    example: { videoId: 1 },
    required: false
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
} 