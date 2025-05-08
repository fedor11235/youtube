import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { notifications } from '../../database/schema';
import { NotificationGateway} from './notification.gateway';
import { eq } from 'drizzle-orm';

@Injectable()
export class NotificationService {
  constructor(
    private readonly db: DrizzleService,
    private readonly notificationGateway: NotificationGateway
  ) {}

  async createNotification(data: {
    channelId: number;
    title: string;
    message: string;
    type: 'like' | 'comment' | 'reply' | 'subscribe' | 'system';
    data?: any;
  }) {
    const [notification] = await this.db
      .insert(notifications)
      .values({
        ...data,
        read: false,
        createdAt: new Date()
      })
      .returning();
    this.notificationGateway.sendNotification(data.channelId, notification)
    return notification;
  }

  async getChannelNotifications(channelId: number) {
    return this.db
      .select(notifications)
      .where(eq(notifications.channelId, channelId))
      .orderBy(notifications.createdAt);
  }

  async markAsRead(id: number, channelId: number) {
    await this.db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .where(eq(notifications.channelId, channelId));
  }

  async markAllAsRead(channelId: number) {
    await this.db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.channelId, channelId));
  }

  async deleteNotification(id: number, channelId: number) {
    await this.db
      .delete(notifications)
      .where(eq(notifications.id, id))
      .where(eq(notifications.channelId, channelId));
  }

  async deleteAllNotifications(channelId: number) {
    await this.db
      .delete(notifications)
      .where(eq(notifications.channelId, channelId));
  }
}