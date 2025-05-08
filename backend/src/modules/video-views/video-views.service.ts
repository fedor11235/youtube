import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { videoHistory, videoViews } from '../../database/schema';
import { and, eq, sql } from 'drizzle-orm';

@Injectable()
export class VideoViewsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async addView(channelId: number | null, videoId: number) {
    if (channelId) {
      const recentView = await this.drizzleService.db
        .select()
        .from(videoViews)
        .where(
          and(
            eq(videoViews.channelId, channelId),
            eq(videoViews.videoId, videoId),
            sql`${videoViews.createdAt} > NOW() - INTERVAL '24 hours'`
          )
        )
        .execute();

        this.drizzleService.db.insert(videoHistory)
          .values({
            channelId,
            videoId,
            watchedAt: new Date()
          })
          .execute();

      if (recentView.length === 0) {
        await this.drizzleService.db
          .insert(videoViews)
          .values({
            channelId,
            videoId,
            createdAt: new Date(),
          })
          .execute();
      }
    } else {
      await this.drizzleService.db
        .insert(videoViews)
        .values({
          videoId,
          createdAt: new Date(),
        })
        .execute();
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