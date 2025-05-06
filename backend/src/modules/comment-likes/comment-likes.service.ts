import { Injectable, ConflictException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { commentLikes, comments } from '../../database/schema';
import { and, eq, sql } from 'drizzle-orm';

@Injectable()
export class CommentLikesService {
  constructor(private readonly db: DrizzleService) {}

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