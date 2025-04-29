import { Module } from '@nestjs/common';
import { VideoHistoryController } from './video-history.controller';
import { VideoHistoryService } from './video-history.service';

@Module({
  controllers: [VideoHistoryController],
  providers: [VideoHistoryService],
})
export class VideoHistoryModule {}