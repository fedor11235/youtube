import { Module } from '@nestjs/common';
import { VideoLikesController } from './video-likes.controller';
import { VideoLikesService } from './video-likes.service';

@Module({
  controllers: [VideoLikesController],
  providers: [VideoLikesService],
})
export class VideoLikesModule {}