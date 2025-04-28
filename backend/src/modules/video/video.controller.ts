import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, UseGuards, Req, Delete, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Videos')
@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
    @Req() req
  ) {
    return this.videoService.createVideo(file, createVideoDto, req.user.id);
  }

  @Get()
  async getAllVideos() {
    return this.videoService.getAllVideos();
  }

  @Get(':id')
  async getVideoById(@Param('id') id: string) {
    return this.videoService.getVideoById(parseInt(id));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteVideo(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any
  ) {
    return this.videoService.deleteVideo(id, req.user.id);
  }
}