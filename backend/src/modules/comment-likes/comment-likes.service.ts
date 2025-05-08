import { Injectable, ConflictException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { commentLikes, comments, users, videos } from '../../database/schema';
import { and, eq, sql } from 'drizzle-orm';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentLikesService {
  constructor(
    private readonly db: DrizzleService,
    private readonly notificationService: NotificationService
  ) {}

  async likeComment(userId: number, commentId: number) {
    const [comment] = await this.db
      .select(comments, {
        id: comments.id,
        userId: comments.userId
      })
      .where(eq(comments.id, commentId));

    // Проверяем, является ли лайкающий пользователь автором комментария
    const isCreatorLike = comment.userId === userId;

    await this.db.insert(commentLikes)
      .values({
        userId,
        commentId,
        isCreatorLike,
        createdAt: new Date()
      })
      .execute();

    if(isCreatorLike) return

    const result = await this.db
    .select(users, {
      id: users.id,
      email: users.email,
      username: users.username,
      createdAt: users.createdAt,
      avatar: users.avatar,
      banner: users.banner,
      url: users.url
    }).where(eq(users.id, comment.userId));


  const resultTwo = await this.db
    .select(users, {
      id: users.id,
      email: users.email,
      username: users.username,
      createdAt: users.createdAt,
      avatar: users.avatar,
      banner: users.banner,
      url: users.url
    }).where(eq(users.id, userId));


    await this.notificationService.createNotification({
        userId: result[0].id,
        title: 'Новый лайк',
        message: `На ваш комментарий поставили лайк!`,
        type: 'like',
        data: {
          user: resultTwo[0],
        }
      });
    return { success: true };
  }

  async unlikeComment(userId: number, commentId: number) {
    await this.db.delete(commentLikes)
      .where(
        and(
          eq(commentLikes.userId, userId),
          eq(commentLikes.commentId, commentId)
        )
      )
      .execute();
    return { success: true };
  }

  async getLikesCount(commentId: number) {
    const result = await this.db
      .select(commentLikes, { count: sql<number>`count(*)` })
      .where(eq(commentLikes.commentId, commentId))
      .execute();
    return result[0].count;
  }

  async hasUserLiked(userId: number, commentId: number) {
    const like = await this.db
      .select(commentLikes)
      .where(
        and(
          eq(commentLikes.userId, userId),
          eq(commentLikes.commentId, commentId)
        )
      )
      .execute();
    return like.length > 0;
  }
}