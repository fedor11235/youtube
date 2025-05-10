import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { videoHistory, videoViews } from '../../database/schema';
import { and, eq, sql } from 'drizzle-orm';

@Injectable()
export class VideoViewsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async addView(channelId: number | null, videoId: number) {
    const now = new Date();
  
    if (channelId) {
      // Получаем количество просмотров этого пользователя за последние 24 часа
      const recentViews = await this.drizzleService.db
        .select()
        .from(videoViews)
        .where(
          and(
            eq(videoViews.channelId, channelId),
            sql`${videoViews.createdAt} > NOW() - INTERVAL '24 hours'`
          )
        )
        .execute();
  
      if (recentViews.length >= 50) {
        // Лимит исчерпан — не засчитываем просмотр
        return;
      }
  
      // Проверка: был ли просмотр конкретного видео за 24ч
      const hasViewedThisVideo = recentViews.some(view => view.videoId === videoId);
  
      // Записываем в историю в любом случае
      await this.drizzleService.db.insert(videoHistory).values({
        channelId,
        videoId,
        watchedAt: now
      }).execute();
  
      // Если это видео ещё не просматривалось за последние 24ч — засчитываем просмотр
      if (!hasViewedThisVideo) {
        await this.drizzleService.db.insert(videoViews).values({
          channelId,
          videoId,
          createdAt: now
        }).execute();
      }
  
    } else {
      // Анонимный пользователь — просто добавляем просмотр
      await this.drizzleService.db.insert(videoViews).values({
        videoId,
        createdAt: now
      }).execute();
    }
  }
  

  async getViewsCount(videoId: number): Promise<number> {
    const result = await this.drizzleService.db
      .select({ count: sql<number>`count(*)` })
      .from(videoViews)
      .where(eq(videoViews.videoId, videoId))
      .execute();
    
    return result[0].count;
  }
}