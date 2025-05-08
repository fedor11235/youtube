import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { commentLikes, comments, channels, videos } from '../../database/schema';
import { eq, sql } from 'drizzle-orm';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly db: DrizzleService,
    private readonly notificationService: NotificationService
  ) {}

  async createComment(channelId: number, videoId: number, content: string) {
    const [comment] = await this.db
      .insert(comments)
      .values({
        channelId,
        videoId,
        content,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

      const video = await this.db.query.videos.findFirst({
        where: eq(videos.id, videoId),
      });

      if(!video?.channelId) return

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

      if(video.channelId === result[0].id) return

      await this.notificationService.createNotification({
        channelId: video.channelId,
        title: 'Новый комментарий',
        message: `Под вашим видео оставили новый комментарий!`,
        type: 'comment',
        data: {
          channel: result[0],
        }
      });
    
    return comment;
  }

  async getVideoComments(videoId: number) {
    const result = await this.db
    .select(comments, {
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      parentId: comments.parentId,
      channel: {
        id: channels.id,
        username: channels.username,
        avatar: channels.avatar
      },
      isCreator: sql<boolean>`CASE WHEN ${videos.channelId} = ${channels.id} THEN true ELSE false END`,
      likes: sql<number>`COUNT(DISTINCT ${commentLikes.id})`
    })
    .leftJoin(channels, eq(comments.channelId, channels.id))
    .leftJoin(videos, eq(comments.videoId, videos.id))
    .leftJoin(commentLikes, eq(comments.id, commentLikes.commentId))
    .where(eq(comments.videoId, videoId))
    .groupBy(comments.id, channels.id, videos.channelId)
    .orderBy(comments.createdAt);
  // Убедимся, что comments является массивом
  if (!Array.isArray(result)) {
    return [];
  }

  // Создаем Map для хранения комментариев и их ответов
  const commentMap = new Map();
  const rootComments: any = [];
  // Первый проход: создаем все комментарии
  result.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Второй проход: организуем структуру ответов
  result.forEach((comment: any) => {
    if (comment.parentId && commentMap.has(comment.parentId)) {
      // Это ответ - добавляем его к родительскому комментарию
      const parentComment = commentMap.get(comment.parentId);
      parentComment.replies.push(commentMap.get(comment.id));
    } else {
      // Это корневой комментарий
      rootComments.push(commentMap.get(comment.id));
    }
  });

  return rootComments;
  }

  async updateComment(commentId: number, channelId: number, content: string) {
    const [comment] = await this.db
      .select(comments)
      .where(eq(comments.id, commentId));

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment.channelId !== channelId) {
      throw new Error('Нет прав на редактирование комментария');
    }

    return this.db
      .update(comments)
      .set({
        content,
        updatedAt: new Date()
      })
      .where(eq(comments.id, commentId))
      .returning();
  }

  async deleteComment(commentId: number, channelId: number) {
    const [comment] = await this.db
      .select(comments)
      .where(eq(comments.id, commentId));

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment.channelId !== channelId) {
      throw new Error('Нет прав на удаление комментария');
    }

    await this.db
      .delete(comments)
      .where(eq(comments.id, commentId));

    return { success: true };
  }

  async createReply(channelId: number, commentId: number, content: string) {
    const [parentComment] = await this.db
      .select(comments)
      .where(eq(comments.id, commentId));

    if (!parentComment) {
      throw new NotFoundException('Комментарий не найден');
    }

    // Создаем ответ на комментарий
    const [reply] = await this.db
      .insert(comments)
      .values({
        content,
        channelId,
        videoId: parentComment.videoId,
        parentId: commentId
      })
      .returning();

      const video = await this.db.query.videos.findFirst({
        where: eq(videos.id, parentComment.videoId),
      });

      if(!video?.channelId) return

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

      if(parentComment.channelId === result[0].id) return

      await this.notificationService.createNotification({
        channelId: parentComment.channelId,
        title: 'Новый ответ',
        message: `Вам ответили на комментарий!`,
        type: 'comment',
        data: {
          channel: result[0],
        }
      });

    return reply;
  }

  async checkCreatorLike(commentId: number): Promise<boolean> {
    const [result] = await this.db
      .select(commentLikes, {
        exists: sql<boolean>`EXISTS (
          SELECT 1 
          FROM ${commentLikes} 
          WHERE ${commentLikes.commentId} = ${commentId} 
          AND ${commentLikes.isCreatorLike} = true
        )`
      })
  
    return result?.exists || false;
  }
}