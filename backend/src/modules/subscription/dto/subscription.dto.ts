import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID of the channel to subscribe to', example: 1 })
  @IsNumber()
  channelId: number;
} 