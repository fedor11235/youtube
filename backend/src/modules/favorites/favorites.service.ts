import { Injectable, ConflictException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { favorites, users, videos } from '../../database/schema';
import { and, desc, eq } from 'drizzle-orm';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DrizzleService) {}

  async addToFavorites(userId: number, videoId: number) {
    try {
      await this.db.insert(favorites)
        .values({
          userId,
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

  async removeFromFavorites(userId: number, videoId: number) {
    await this.db.delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.videoId, videoId)
        )
      )
      .execute();
    return { success: true };
  }

  async isInFavorites(userId: number, videoId: number) {
    const result = await this.db
      .select(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.videoId, videoId)
        )
      )
      .execute();
    return result.length > 0;
  }

  async getFavoriteVideos(userId: number) {
    return this.db
      .select(favorites, {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        createdAt: videos.createdAt,
        views: videos.views,
        user: {
          id: users.id,
          username: users.firstName,
          avatar: users.avatar
        }
      })
      .innerJoin(videos, eq(favorites.videoId, videos.id))
      .innerJoin(users, eq(videos.userId, users.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt))
      .execute();
  }
}