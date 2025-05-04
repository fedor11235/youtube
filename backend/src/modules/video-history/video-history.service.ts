import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { videoHistory, videos, users } from '../../database/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class VideoHistoryService {
  constructor(private readonly db: DrizzleService) {}

  async addToHistory(userId: number, videoId: number) {
    return this.db.insert(videoHistory)
      .values({
        userId,
        videoId,
        watchedAt: new Date()
      })
      .execute();
  }

  async getHistory(userId: number) {
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
          user: {
            id: users.id,
            firstName: users.firstName,
            avatar: users.avatar
          }
        }
      })
      .innerJoin(videos, eq(videos.id, videoHistory.videoId))
      .innerJoin(users, eq(users.id, videos.userId))
      .where(eq(videoHistory.userId, userId))
      .orderBy(desc(videoHistory.watchedAt));
  }

  async clearHistory(userId: number) {
    return this.db
      .delete(videoHistory)
      .where(eq(videoHistory.userId, userId))
      .execute();
  }
}