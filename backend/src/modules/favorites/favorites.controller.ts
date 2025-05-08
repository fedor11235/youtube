import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':videoId')
  @UseGuards(JwtAuthGuard)
  async addToFavorites(
    @Param('videoId') videoId: number,
    @Request() req
  ) {
    return this.favoritesService.addToFavorites(req.channel.id, videoId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Request() req) {
    return this.favoritesService.getFavoriteVideos(parseInt(req.channel.id));
  }

  @Delete(':videoId')
  @UseGuards(JwtAuthGuard)
  async removeFromFavorites(
    @Param('videoId') videoId: number,
    @Request() req
  ) {
    return this.favoritesService.removeFromFavorites(req.channel.id, videoId);
  }

  @Get(':videoId/check')
  @UseGuards(JwtAuthGuard)
  async checkFavorite(
    @Param('videoId') videoId: number,
    @Request() req
  ) {
    const isInFavorites = await this.favoritesService.isInFavorites(req.channel.id, videoId);
    return { isInFavorites };
  }
}