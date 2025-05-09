import { Controller, Get, Param } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все теги' })
  @ApiResponse({ status: 200, description: 'Список тегов успешно получен' })
  async getTags() {
    return this.tagService.getTags();
  }

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Получить теги видео' })
  @ApiResponse({ status: 200, description: 'Теги видео успешно получены' })
  async getVideoTags(@Param('videoId') videoId: number) {
    return this.tagService.getVideoTags(videoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить тег по ID' })
  @ApiResponse({ status: 200, description: 'Тег успешно получен' })
  async getTagById(@Param('id') id: number) {
    return this.tagService.getTagById(id);
  }
}