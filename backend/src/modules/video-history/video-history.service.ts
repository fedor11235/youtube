import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { videoHistory, videos, channels } from '../../database/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class VideoHistoryService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async addToHistory(channelId: number, videoId: number) {
    return this.drizzleService.db.insert(videoHistory)
      .values({
        channelId,
        videoId,
        watchedAt: new Date()
      })
      .execute();
  }

  async getHistory(channelId: number) {
    const result = await this.drizzleService.db
      .select({
        id: videoHistory.id,
        watchedAt: videoHistory.watchedAt,
        videoId: videos.id,
        title: videos.title,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        videoCreatedAt: videos.createdAt,
        channelId: channels.id,
        username: channels.username,
        avatar: channels.avatar
      })
      .from(videoHistory)
      .innerJoin(videos, eq(videos.id, videoHistory.videoId))
      .innerJoin(channels, eq(channels.id, videos.channelId))
      .where(eq(videoHistory.channelId, channelId))
      .orderBy(desc(videoHistory.watchedAt));
  
    return result.map((row) => ({
      id: row.id,
      watchedAt: row.watchedAt,
      video: {
        id: row.videoId,
        title: row.title,
        thumbnailUrl: row.thumbnailUrl,
        views: row.views,
        createdAt: row.videoCreatedAt,
        channel: {
          id: row.channelId,
          username: row.username,
          avatar: row.avatar
        }
      }
    }));
  }

  async clearHistory(channelId: number) {
    return this.drizzleService.db
      .delete(videoHistory)
      .where(eq(videoHistory.channelId, channelId))
      .execute();
  }
}