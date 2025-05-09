import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { CreateNotification, notifications, type Notification } from '../../database/schema';
import { NotificationGateway} from './notification.gateway';
import { eq } from 'drizzle-orm';

@Injectable()
export class NotificationService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly notificationGateway: NotificationGateway
  ) {}

  async createNotification(data: CreateNotification) {
    const [notification] = await this.drizzleService.db
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
    return this.drizzleService.db
      .select()
      .from(notifications)
      .where(eq(notifications.channelId, channelId))
      .orderBy(notifications.createdAt);
  }

  async markAsRead(id: number, channelId: number) {
    await this.drizzleService.db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
  }

  async markAllAsRead(channelId: number) {
    await this.drizzleService.db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.channelId, channelId));
  }

  async deleteNotification(id: number, channelId: number) {
    await this.drizzleService.db
      .delete(notifications)
      .where(eq(notifications.id, id))
  }

  async deleteAllNotifications(channelId: number) {
    await this.drizzleService.db
      .delete(notifications)
      .where(eq(notifications.channelId, channelId));
  }
}