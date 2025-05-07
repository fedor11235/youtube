import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { NotificationService } from '../notification/notification.service'

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, NotificationService],
})
export class SubscriptionModule {}