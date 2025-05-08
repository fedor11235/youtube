import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { VideoLikesService } from './video-likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('video-likes')
export class VideoLikesController {
  constructor(private readonly videoLikesService: VideoLikesService) {}

  @Post(':videoId')
  @UseGuards(JwtAuthGuard)
  async likeVideo(
    @Request() req,
    @Param('videoId') videoId: string
  ) {
    return this.videoLikesService.likeVideo(req.channel.id, parseInt(videoId));
  }

  @Delete(':videoId')
  @UseGuards(JwtAuthGuard)
  async unlikeVideo(
    @Request() req,
    @Param('videoId') videoId: string
  ) {
    return this.videoLikesService.unlikeVideo(req.channel.id, parseInt(videoId));
  }

  @Get(':videoId/count')
  async getLikesCount(@Param('videoId') videoId: string) {
    return this.videoLikesService.getLikesCount(parseInt(videoId));
  }

  @Get(':videoId/has-liked')
  @UseGuards(JwtAuthGuard)
  async hasChannelLiked(
    @Request() req,
    @Param('videoId') videoId: string
  ) {
    return {
      hasLiked: await this.videoLikesService.hasChannelLiked(req.channel.id, parseInt(videoId))
    };
  }
}