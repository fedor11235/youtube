import { Injectable, ConflictException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { favorites, channels, videos } from '../../database/schema';
import { and, desc, eq } from 'drizzle-orm';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DrizzleService) {}

  async addToFavorites(channelId: number, videoId: number) {
    try {
      await this.db.insert(favorites)
        .values({
          channelId,
          videoId,
          createdAt: new Date()
        })
        .execute();
      return { success: true };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Видео уже в избранном');
      }
      throw error;
    }
  }

  async removeFromFavorites(channelId: number, videoId: number) {
    await this.db.delete(favorites)
      .where(
        and(
          eq(favorites.channelId, channelId),
          eq(favorites.videoId, videoId)
        )
      )
      .execute();
    return { success: true };
  }

  async isInFavorites(channelId: number, videoId: number) {
    const result = await this.db
      .select(favorites)
      .where(
        and(
          eq(favorites.channelId, channelId),
          eq(favorites.videoId, videoId)
        )
      )
      .execute();
    return result.length > 0;
  }

  async getFavoriteVideos(channelId: number) {
    return this.db
      .select(favorites, {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        createdAt: videos.createdAt,
        views: videos.views,
        channel: {
          id: channels.id,
          username: channels.username,
          avatar: channels.avatar
        }
      })
      .innerJoin(videos, eq(favorites.videoId, videos.id))
      .innerJoin(channels, eq(videos.channelId, channels.id))
      .where(eq(favorites.channelId, channelId))
      .orderBy(desc(favorites.createdAt))
      .execute();
  }
}