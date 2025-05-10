import { Controller, Post, Get, Delete, Param, UseGuards, Request, Req } from '@nestjs/common';
import { VideoHistoryService } from './video-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('video-history')
@UseGuards(JwtAuthGuard)
export class VideoHistoryController {
  constructor(private readonly videoHistoryService: VideoHistoryService) {}

  @Post(':videoId')
  async addToHistory(
    @Req() req,
    @Param('videoId') videoId: string
  ) {
    return this.videoHistoryService.addToHistory(req.user.id, parseInt(videoId));
  }

  @Get()
  async getHistory(@Req() req) {
    return this.videoHistoryService.getHistory(req.user.id);
  }

  @Delete()
  async clearHistory(@Req() req) {
    return this.videoHistoryService.clearHistory(req.user.id);
  }
}