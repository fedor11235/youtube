import { Module } from '@nestjs/common';
import { VideoLikesController } from './video-likes.controller';
import { VideoLikesService } from './video-likes.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [VideoLikesController],
  providers: [VideoLikesService, NotificationService, NotificationGateway],
})
export class VideoLikesModule {}