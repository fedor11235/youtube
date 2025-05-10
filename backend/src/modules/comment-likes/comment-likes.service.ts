import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    // Получаем комментарий
    const [comment] = await this.drizzleService.db
      .select({
        id: comments.id,
        channelId: comments.channelId
      })
      .from(comments)
      .where(eq(comments.id, commentId));
  
    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }
  
    // Проверка: лайкает ли автор сам себя
    const isCreatorLike = comment.channelId === channelId;
  
    // Можно предотвратить дублирующие лайки
    const existingLike = await this.drizzleService.db
      .select()
      .from(commentLikes)
      .where(
        and(
          eq(commentLikes.channelId, channelId),
          eq(commentLikes.commentId, commentId)
        )
      );
  
    if (existingLike.length > 0) {
      throw new BadRequestException('Вы уже лайкнули этот комментарий');
    }
  
    // Вставка лайка
    await this.drizzleService.db.insert(commentLikes).values({
      channelId,
      commentId,
      isCreatorLike,
      createdAt: new Date()
    });
  
    if (isCreatorLike) return { success: true };
  
    // Получаем автора комментария
    const [commentAuthor] = await this.drizzleService.db
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
  
    // Получаем автора лайка
    const [liker] = await this.drizzleService.db
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
  
    // Отправляем уведомление автору комментария
    await this.notificationService.createNotification({
      channelId: commentAuthor.id,
      title: 'Новый лайк',
      message: `На ваш комментарий поставили лайк!`,
      type: 'like',
      data: {
        channel: liker
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