import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('video/:videoId')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('videoId') videoId: string,
    @Body('content') content: string,
    @Request() req
  ) {
    return this.commentService.createComment(req.user.id, parseInt(videoId), content);
  }

  @Get('video/:videoId')
  async getVideoComments(@Param('videoId') videoId: string) {
    return this.commentService.getVideoComments(parseInt(videoId));
  }

  @Post(':commentId/replies')
  @UseGuards(JwtAuthGuard)
  async createReply(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
    @Request() req
  ) {
    return this.commentService.createReply(req.user.id, parseInt(commentId), content);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @Request() req
  ) {
    return this.commentService.updateComment(parseInt(id), req.user.id, content);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('id') id: string,
    @Request() req
  ) {
    return this.commentService.deleteComment(parseInt(id), req.user.id);
  }
}