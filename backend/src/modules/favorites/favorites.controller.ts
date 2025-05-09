import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Request() req) {
    return this.favoritesService.getFavoriteVideos(parseInt(req.user.id));
  }
  
  @Post(':videoId')
  @UseGuards(JwtAuthGuard)
  async addToFavorites(
    @Param('videoId') videoId: number,
    @Request() req
  ) {
    return this.favoritesService.addToFavorites(req.user.id, videoId);
  }

  @Delete(':videoId')
  @UseGuards(JwtAuthGuard)
  async removeFromFavorites(
    @Param('videoId') videoId: number,
    @Request() req
  ) {
    return this.favoritesService.removeFromFavorites(req.user.id, videoId);
  }

  @Get(':videoId/check')
  @UseGuards(JwtAuthGuard)
  async checkFavorite(
    @Param('videoId') videoId: number,
    @Request() req
  ) {
    const isInFavorites = await this.favoritesService.isInFavorites(req.user.id, videoId);
    return { isInFavorites };
  }
}