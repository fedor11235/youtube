import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { commentLikes, comments, channels } from '../../database/schema';
import { and, eq, sql } from 'drizzle-orm';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentLikesService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly notificationService: NotificationService
  ) {}

  async likeComment(channelId: number, commentId: number) {
    const [comment] = await this.drizzleService.db
      .select({
        id: comments.id,
        channelId: comments.channelId
      })
      .from(channels)
      .where(eq(comments.id, commentId));

    // Проверяем, является ли лайкающий пользователь автором комментария
    const isCreatorLike = comment.channelId === channelId;

    await this.drizzleService.db.insert(commentLikes)
      .values({
        channelId,
        commentId,
        isCreatorLike,
        createdAt: new Date()
      })
      .execute();

    if(isCreatorLike) return

    const result = await this.drizzleService.db
    .select({
      id: channels.id,
      email: channels.email,
      username: channels.username,
      createdAt: channels.createdAt,
      avatar: channels.avatar,
      banner: channels.banner,
      url: channels.url
    })
    .from(channels)
    .where(eq(channels.id, comment.channelId));


  const resultTwo = await this.drizzleService.db
    .select({
      id: channels.id,
      email: channels.email,
      username: channels.username,
      createdAt: channels.createdAt,
      avatar: channels.avatar,
      banner: channels.banner,
      url: channels.url
    })
    .from(channels)
    .where(eq(channels.id, channelId));


    await this.notificationService.createNotification({
      channelId: result[0].id,
        title: 'Новый лайк',
        message: `На ваш комментарий поставили лайк!`,
        type: 'like',
        data: {
          channel: resultTwo[0],
        }
      });
    return { success: true };
  }

  async unlikeComment(channelId: number, commentId: number) {
    await this.drizzleService.db.delete(commentLikes)
      .where(
        and(
          eq(commentLikes.channelId, channelId),
          eq(commentLikes.commentId, commentId)
        )
      )
      .execute();
    return { success: true };
  }

  async getLikesCount(commentId: number) {
    const result = await this.drizzleService.db
      .select({ count: sql<number>`count(*)` })
      .from(commentLikes)
      .where(eq(commentLikes.commentId, commentId))
      .execute();
    return result[0].count;
  }

  async hasChannelLiked(channelId: number, commentId: number) {
    const like = await this.drizzleService.db
      .select()
      .from(commentLikes)
      .where(
        and(
          eq(commentLikes.channelId, channelId),
          eq(commentLikes.commentId, commentId)
        )
      )
      .execute();
    return like.length > 0;
  }
}