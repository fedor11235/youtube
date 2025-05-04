import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { notifications } from '../../database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class NotificationService {
  constructor(private readonly db: DrizzleService) {}

  async createNotification(data: {
    userId: number;
    title: string;
    message: string;
    type: string;
    link?: string;
  }) {
    return this.db.insert(notifications).values(data);
  }

  async getUserNotifications(userId: number) {
    return this.db
      .select(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt);
  }

  async markAsRead(userId: number, notificationId: number) {
    return this.db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        )
      );
  }

  async markAllAsRead(userId: number) {
    return this.db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));
  }

  async deleteNotification(userId: number, notificationId: number) {
    return this.db
      .delete(notifications)
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        )
      );
  }

  async deleteAllNotifications(userId: number) {
    return this.db
      .delete(notifications)
      .where(eq(notifications.userId, userId));
  }
}