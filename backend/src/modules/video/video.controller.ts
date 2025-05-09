import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, UseGuards, Req, Delete, ParseIntPipe, Query, HttpStatus, HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';

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

  @Post('thumbnail') 
  @UseGuards(JwtAuthGuard) 
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './uploads/thumbnails',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, uniqueSuffix + '-' + file.originalname);
        }
      })
    })
  ) 
  async updateThumbnail(
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() body: { videoId: string }
  ) {
    try {
      const channel = await this.videoService.updateThumbnail(parseInt(body.videoId), thumbnail);
      return channel;
    } catch (error) {
      throw new HttpException('Failed to update thumbnail', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllVideos() {
    return this.videoService.getAllVideos();
  }

  @Get('search')
  @ApiOperation({ summary: 'Поиск видео' })
  async searchVideos(
    @Query('q') query: string,
    @Query('tags') tags: string
  ) {
    const tagNames = tags ? tags.split(',') : [];
    return this.videoService.searchVideos(query, tagNames);
  }

  @Get('related/:id')
  async getRelatedVideos(@Param('id') id: string) {
    return this.videoService.getRelatedVideos(parseInt(id));
  }

  @Get('trending')
  async getTrendingVideos() {
    return this.videoService.getTrendingVideos();
  }

  @Get('channel/:channelId')
  async getChannelVideos(
    @Param('channelId', ParseIntPipe) channelId: number
  ) {
    return this.videoService.getChannelVideos(channelId);
  }

  @Get('liked')
  @UseGuards(JwtAuthGuard)
  async getLikedVideos(@Req() req) {
    return this.videoService.getLikedVideos(parseInt(req.user.id));
  }

  @Get(':id')
  async getVideoById(@Param('id') id: string) {
    return this.videoService.getVideoById(parseInt(id));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteVideo(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ) {
    return this.videoService.deleteVideo(id, req.user.id);
  }

  @Post('tags/:videoId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Добавить теги к видео' })
  async addVideoTags(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Body('tags') tags: string[]
  ) {
    return this.videoService.addVideoTags(videoId, tags);
  }
}