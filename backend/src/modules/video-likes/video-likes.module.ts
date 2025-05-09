import { Module } from '@nestjs/common';
import { VideoLikesController } from './video-likes.controller';
import { VideoLikesService } from './video-likes.service';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [VideoLikesController],
  providers: [VideoLikesService],
})
export class VideoLikesModule {}