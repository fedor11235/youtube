import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { NotificationService } from '../notification/notification.service'
import { NotificationGateway } from '../notification/notification.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, NotificationService, NotificationGateway],
})
export class SubscriptionModule {}