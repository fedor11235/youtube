import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { videoHistory, videos, channels } from '../../database/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class VideoHistoryService {
  constructor(private readonly db: DrizzleService) {}

  async addToHistory(channelId: number, videoId: number) {
    return this.db.insert(videoHistory)
      .values({
        channelId,
        videoId,
        watchedAt: new Date()
      })
      .execute();
  }

  async getHistory(channelId: number) {
    return this.db
      .select(videoHistory, {
        id: videoHistory.id,
        watchedAt: videoHistory.watchedAt,
        video: {
          id: videos.id,
          title: videos.title,
          thumbnailUrl: videos.thumbnailUrl,
          views: videos.views,
          createdAt: videos.createdAt,
          channel: {
            id: channels.id,
            username: channels.username,
            avatar: channels.avatar
          }
        }
      })
      .innerJoin(videos, eq(videos.id, videoHistory.videoId))
      .innerJoin(channels, eq(channels.id, videos.channelId))
      .where(eq(videoHistory.channelId, channelId))
      .orderBy(desc(videoHistory.watchedAt));
  }

  async clearHistory(channelId: number) {
    return this.db
      .delete(videoHistory)
      .where(eq(videoHistory.channelId, channelId))
      .execute();
  }
}