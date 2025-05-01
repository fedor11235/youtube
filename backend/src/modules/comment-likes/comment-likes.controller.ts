import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { CommentLikesService } from './comment-likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comment-likes')
export class CommentLikesController {
  constructor(private readonly commentLikesService: CommentLikesService) {}

  @Post(':commentId')
  @UseGuards(JwtAuthGuard)
  async likeComment(
    @Param('commentId') commentId: number,
    @Request() req
  ) {
    return this.commentLikesService.likeComment(req.user.id, commentId);
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  async unlikeComment(
    @Param('commentId') commentId: number,
    @Request() req
  ) {
    return this.commentLikesService.unlikeComment(req.user.id, commentId);
  }

  @Get(':commentId/count')
  async getLikesCount(@Param('commentId') commentId: number) {
    const count = await this.commentLikesService.getLikesCount(commentId);
    return { count };
  }

  @Get(':commentId/has-liked')
  @UseGuards(JwtAuthGuard)
  async hasUserLiked(
    @Param('commentId') commentId: number,
    @Request() req
  ) {
    const hasLiked = await this.commentLikesService.hasUserLiked(req.user.id, commentId);
    return { hasLiked };
  }
}