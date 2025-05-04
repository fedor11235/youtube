import { Module } from '@nestjs/common';
import { VideoViewsController } from './video-views.controller';
import { VideoViewsService } from './video-views.service';

@Module({
  controllers: [VideoViewsController],
  providers: [VideoViewsService],
  exports: [VideoViewsService]
})
export class VideoViewsModule {}