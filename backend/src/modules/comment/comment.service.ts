import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { commentLikes, comments, channels, videos, type Comment } from '../../database/schema';
import { eq, sql } from 'drizzle-orm';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly notificationService: NotificationService
  ) {}

  async createComment(channelId: number, videoId: number, content: string) {
    const commentsResult = await this.drizzleService.db
      .insert(comments)
      .values({
        channelId,
        videoId,
        content,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

      const comment = commentsResult[0]

      const video = await this.drizzleService.db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1)
      .then(rows => rows[0]);

      if(!video?.channelId) return

      const channelsResult = await this.drizzleService.db
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

      if(video.channelId === channelsResult[0].id) return

      await this.notificationService.createNotification({
        channelId: video.channelId,
        title: 'Новый комментарий',
        message: `Под вашим видео оставили новый комментарий!`,
        type: 'comment',
        data: {
          channel: channelsResult[0],
        },
      });
    
    return comment;
  }

  async getVideoComments(videoId: number) {
    const result = await this.drizzleService.db
    .select({
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
    .from(comments)
    .leftJoin(channels, eq(comments.channelId, channels.id))
    .leftJoin(videos, eq(comments.videoId, videos.id))
    .leftJoin(commentLikes, eq(comments.id, commentLikes.commentId))
    .where(eq(comments.videoId, videoId))
    .groupBy(comments.id, channels.id, videos.channelId)
    .orderBy(comments.createdAt);
  if (!Array.isArray(result)) {
    return [];
  }

  const commentMap = new Map();
  const rootComments: Comment[] = [];

  result.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  result.forEach((comment: Comment) => {
    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parentComment = commentMap.get(comment.parentId);
      parentComment.replies.push(commentMap.get(comment.id));
    } else {
      rootComments.push(commentMap.get(comment.id));
    }
  });

  return rootComments;
  }

  async updateComment(commentId: number, channelId: number, content: string) {
    const [comment] = await this.drizzleService.db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId));

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment.channelId !== channelId) {
      throw new Error('Нет прав на редактирование комментария');
    }

    return this.drizzleService.db
      .update(comments)
      .set({
        content,
        updatedAt: new Date()
      })
      .where(eq(comments.id, commentId))
      .returning();
  }

  async deleteComment(commentId: number, channelId: number) {
    const [comment] = await this.drizzleService.db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId));

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment.channelId !== channelId) {
      throw new Error('Нет прав на удаление комментария');
    }

    await this.drizzleService.db
      .delete(comments)
      .where(eq(comments.id, commentId));

    return { success: true };
  }

  async createReply(channelId: number, commentId: number, content: string) {
    const [parentComment] = await this.drizzleService.db
      .select(comments)
      .from(comments)
      .where(eq(comments.id, commentId));

    if (!parentComment) {
      throw new NotFoundException('Комментарий не найден');
    }

    const replyResult = await this.drizzleService.db
      .insert(comments)
      .values({
        content,
        channelId,
        videoId: parentComment.videoId,
        parentId: commentId
      })
      .returning();

      const reply = replyResult[0]

      const video = await this.drizzleService.db
        .select()
        .from(videos)
        .where(eq(videos.id, parentComment.videoId))
        .limit(1)
        .then(rows => rows[0]);

      if(!video?.channelId) return

      const channelResult = await this.drizzleService.db
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

      if(parentComment.channelId === channelResult[0].id) return

      await this.notificationService.createNotification({
        channelId: parentComment.channelId,
        title: 'Новый ответ',
        message: `Вам ответили на комментарий!`,
        type: 'comment',
        data: {
          channel: channelResult[0],
        }
      });

    return reply;
  }

  async checkCreatorLike(commentId: number): Promise<boolean> {
    const [result] = await this.drizzleService.db
      .select({
        exists: sql<boolean>`EXISTS (
          SELECT 1 
          FROM ${commentLikes} 
          WHERE ${commentLikes.commentId} = ${commentId} 
          AND ${commentLikes.isCreatorLike} = true
        )`
      })
      .from(channels)
  
    return result?.exists || false;
  }
}