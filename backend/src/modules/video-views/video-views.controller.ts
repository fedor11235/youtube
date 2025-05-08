import { Controller, Post, Param, UseGuards, Req, Get } from '@nestjs/common';
import { VideoViewsService } from './video-views.service';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';

@Controller('video-views')
export class VideoViewsController {
  constructor(private readonly videoViewsService: VideoViewsService) {}

  @Post(':videoId')
  @UseGuards(OptionalJwtAuthGuard)
  async addView(@Req() req, @Param('videoId') videoId: string) {
    const channelId = req.channel?.id || null;
    await this.videoViewsService.addView(channelId, parseInt(videoId));
    return { success: true };
  }

  @Get(':videoId/count')
  async getViewsCount(@Param('videoId') videoId: string) {
    const count = await this.videoViewsService.getViewsCount(parseInt(videoId));
    return { count };
  }
}