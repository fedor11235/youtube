import { Injectable, ConflictException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { videoLikes } from '../../database/schema';
import { eq, and, sql } from 'drizzle-orm';

@Injectable()
export class VideoLikesService {
  constructor(private readonly db: DrizzleService) {}

  async likeVideo(userId: number, videoId: number) {
    try {
      await this.db.insert(videoLikes)
        .values({
          userId,
          videoId,
          createdAt: new Date()
        })
        .execute();
      return { success: true };
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new ConflictException('Вы уже поставили лайк этому видео');
      }
      throw error;
    }
  }

  async unlikeVideo(userId: number, videoId: number) {
    await this.db.delete(videoLikes)
      .where(
        and(
          eq(videoLikes.userId, userId),
          eq(videoLikes.videoId, videoId)
        )
      )
      .execute();
    return { success: true };
  }

  async getLikesCount(videoId: number) {
    const result = await this.db
      .select(videoLikes, { count: sql<number>`count(*)` })
      .where(eq(videoLikes.videoId, videoId))
      .execute();
    return result[0].count;
  }

  async hasUserLiked(userId: number, videoId: number) {
    const like = await this.db
      .select(videoLikes)
      .where(
        and(
          eq(videoLikes.userId, userId),
          eq(videoLikes.videoId, videoId)
        )
      )
      .execute();
    return like.length > 0;
  }
}