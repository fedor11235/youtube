import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { channels, videoLikes, videos } from '../../database/schema';
import { eq, and, sql } from 'drizzle-orm';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class VideoLikesService {
  constructor(
    private readonly db: DrizzleService,
    private readonly notificationService: NotificationService
  ) {}

  async likeVideo(channelId: number, videoId: number) {
    const video = await this.db.query.videos.findFirst({
      where: eq(videos.id, videoId),
    });

    if(!video?.channelId) return

    await this.db.insert(videoLikes)
      .values({
        channelId,
        videoId,
        createdAt: new Date()
      })
      .execute();

    const result = await this.db
      .select(channels, {
        id: channels.id,
        email: channels.email,
        username: channels.username,
        createdAt: channels.createdAt,
        avatar: channels.avatar,
        banner: channels.banner,
        url: channels.url
      }).where(eq(channels.id, channelId));

      await this.notificationService.createNotification({
        channelId: video.channelId,
        title: 'Новый лайк',
        message: `Ваше видео лайкнул пользователь!`,
        type: 'like',
        data: {
          channel: result[0],
        }
      });
    return { success: true };
  }

  async unlikeVideo(channelId: number, videoId: number) {
    await this.db.delete(videoLikes)
      .where(
        and(
          eq(videoLikes.channelId, channelId),
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

  async hasChannelLiked(channelId: number, videoId: number) {
    const like = await this.db
      .select(videoLikes)
      .where(
        and(
          eq(videoLikes.channelId, channelId),
          eq(videoLikes.videoId, videoId)
        )
      )
      .execute();
    return like.length > 0;
  }
}