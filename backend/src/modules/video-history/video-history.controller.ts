import { Controller, Post, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { VideoHistoryService } from './video-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('video-history')
@UseGuards(JwtAuthGuard)
export class VideoHistoryController {
  constructor(private readonly videoHistoryService: VideoHistoryService) {}

  @Post(':videoId')
  async addToHistory(
    @Request() req,
    @Param('videoId') videoId: string
  ) {
    return this.videoHistoryService.addToHistory(req.channel.id, parseInt(videoId));
  }

  @Get()
  async getHistory(@Request() req) {
    return this.videoHistoryService.getHistory(req.channel.id);
  }

  @Delete()
  async clearHistory(@Request() req) {
    return this.videoHistoryService.clearHistory(req.channel.id);
  }
}