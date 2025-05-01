import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { comments, users } from '../../database/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class CommentService {
  constructor(private readonly db: DrizzleService) {}

  async createComment(userId: number, videoId: number, content: string) {
    const [comment] = await this.db
      .insert(comments)
      .values({
        userId,
        videoId,
        content,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return comment;
  }

  async getVideoComments(videoId: number) {
    return this.db
      .select(comments, {
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        user: {
          id: users.id,
          firstName: users.firstName,
          avatar: users.avatar,
          url: users.url
        }
      })
      .innerJoin(users, eq(users.id, comments.userId))
      .where(eq(comments.videoId, videoId))
      .orderBy(desc(comments.createdAt));
  }

  async updateComment(commentId: number, userId: number, content: string) {
    const [comment] = await this.db
      .select(comments)
      .where(eq(comments.id, commentId));

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment.userId !== userId) {
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

  async deleteComment(commentId: number, userId: number) {
    const [comment] = await this.db
      .select(comments)
      .where(eq(comments.id, commentId));

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment.userId !== userId) {
      throw new Error('Нет прав на удаление комментария');
    }

    await this.db
      .delete(comments)
      .where(eq(comments.id, commentId));

    return { success: true };
  }
}