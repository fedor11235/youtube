import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { notifications } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationService {
  @WebSocketServer()
  server: Server;

  constructor(private readonly db: DrizzleService) {}

  async createNotification(data: {
    userId: number;
    title: string;
    message: string;
    type: 'like' | 'comment' | 'reply' | 'mention' | 'system';
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

    this.server.to(`user_${data.userId}`).emit('notification', notification);
    return notification;
  }

  async getUserNotifications(userId: number) {
    return this.db
      .select(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt);
  }

  async markAsRead(id: number, userId: number) {
    await this.db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .where(eq(notifications.userId, userId));
  }

  async markAllAsRead(userId: number) {
    await this.db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));
  }

  async deleteNotification(id: number, userId: number) {
    await this.db
      .delete(notifications)
      .where(eq(notifications.id, id))
      .where(eq(notifications.userId, userId));
  }

  async deleteAllNotifications(userId: number) {
    await this.db
      .delete(notifications)
      .where(eq(notifications.userId, userId));
  }
}