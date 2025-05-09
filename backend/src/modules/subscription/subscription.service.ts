import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { eq, and, sql } from 'drizzle-orm';
// import { subscriptions } from '../drizzle/schema';
import { subscriptions, channels } from '../../database/schema';
import { NotificationService } from '../notification/notification.service'

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly notificationService: NotificationService
  ) {}

  async subscribe(subscriberId: number, channelURL: string) {
    const channel = await this.drizzleService.db
      .select()
      .from(channels)
      .where(eq(channels.url, channelURL))
      .limit(1)
      .then(rows => rows[0]);

    if(!channel) {
      return
    }
    // Проверяем, существует ли уже подписка
    const existingSubscription = await this.drizzleService.db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.subscriberId, subscriberId),
          eq(subscriptions.channelId, channel.id)
        )
      )
      .execute();

    if (existingSubscription.length > 0) {
      throw new ConflictException('Already subscribed');
    }

    const result = await this.drizzleService.db
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
    .where(eq(channels.id, subscriberId));

    await this.notificationService.createNotification({
      channelId: channel.id,
      title: 'Новый подписчик',
      message: `У вас новый подписчик!`,
      type: 'subscribe',
      data: {
        user: result[0],
      }
    });

    // Создаем новую подписку
    return this.drizzleService.db
      .insert(subscriptions)
      .values({
        subscriberId: subscriberId,
        channelId: channel.id,
        createdAt: new Date()
      })
      .execute();
  }

  async unsubscribe(subscriberId: number, channelURL: string) {
    const channel = await this.drizzleService.db
      .select()
      .from(channels)
      .where(eq(channels.url, channelURL))
      .limit(1)
      .then(rows => rows[0]);

    if(!channel) {
      return
    }

    const result = await this.drizzleService.db
      .delete(subscriptions)
      .where(
        and(
          eq(subscriptions.subscriberId, subscriberId),
          eq(subscriptions.channelId, channel.id)
        )
      )
      .execute();

    if (!result) {
      throw new NotFoundException('Subscription not found');
    }

    return result;
  }

  async getSubscriptions(subscriberId: number) {  
    return this.drizzleService.db
      .select({
        channel: {
          id: channels.id,
          username: channels.username,
          avatar: channels.avatar,
          subscribersCount: sql<number>`(
            SELECT count(*)
            FROM ${subscriptions}
            WHERE ${subscriptions.channelId} = ${channels.id}
          )`.as('subscribers_count')
        }
      })
      .from(subscriptions)
      .innerJoin(channels, eq(channels.id, subscriptions.channelId))
      .where(eq(subscriptions.subscriberId, subscriberId))
      .groupBy(channels.id)
      .execute();
  }

  async getSubscribers(channelURL: string) {
    const channel = await this.drizzleService.db
      .select()
      .from(channels)
      .where(eq(channels.url, channelURL))
      .limit(1)
      .then(rows => rows[0]);

    if(!channel) {
      return
    }

    return this.drizzleService.db
      .select({
        subscriber: {
          id: channels.id,
          username: channels.url,
          avatar: channels.avatar
        }
      })
      .from(subscriptions)
      .innerJoin(channels, eq(channels.id, subscriptions.subscriberId))
      .where(eq(subscriptions.channelId, channel.id))
      .execute();
  }

  async checkSubscription(subscriberId: number, channelURL: string) {
    const channel = await this.drizzleService.db
      .select()
      .from(channels)
      .where(eq(channels.url, channelURL))
      .limit(1)
      .then(rows => rows[0]);

    if(!channel) {
      return
    }

    const subscription = await this.drizzleService.db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.subscriberId, subscriberId),
          eq(subscriptions.channelId, channel.id)
        )
      )
      .execute();

    return subscription.length > 0;
  }
}