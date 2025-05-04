import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { videoHistory, videoViews } from '../../database/schema';
import { and, eq, sql } from 'drizzle-orm';

@Injectable()
export class VideoViewsService {
  constructor(private readonly db: DrizzleService) {}

  async addView(userId: number | null, videoId: number) {
    // Если пользователь авторизован, сохраняем информацию о просмотре
    if (userId) {
      // Проверяем, не смотрел ли пользователь это видео в последние 24 часа
      const recentView = await this.db
        .select(videoViews)
        .where(
          and(
            eq(videoViews.userId, userId),
            eq(videoViews.videoId, videoId),
            sql`${videoViews.createdAt} > NOW() - INTERVAL '24 hours'`
          )
        )
        .execute();

        this.db.insert(videoHistory)
          .values({
            userId,
            videoId,
            watchedAt: new Date()
          })
          .execute();

      if (recentView.length === 0) {
        await this.db
          .insert(videoViews)
          .values({
            userId,
            videoId,
            createdAt: new Date(),
          })
          .execute();
      }
    } else {
      // Для неавторизованных пользователей просто увеличиваем счетчик
      await this.db
        .insert(videoViews)
        .values({
          videoId,
          createdAt: new Date(),
        })
        .execute();
    }
  }

  async getViewsCount(videoId: number): Promise<number> {
    const result = await this.db
      .select(videoViews, { count: sql<number>`count(*)` })
      .where(eq(videoViews.videoId, videoId))
      .execute();
    
    return result[0].count;
  }
}