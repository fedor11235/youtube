import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { eq, and, sql } from 'drizzle-orm';
// import { subscriptions } from '../drizzle/schema';
import { subscriptions, users } from '../../database/schema';

@Injectable()
export class SubscriptionService {
  constructor(private readonly db: DrizzleService) {}

  async subscribe(userURL: string, channelURL: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.url, userURL),
    });

    const channel = await this.db.query.users.findFirst({
      where: eq(users.url, channelURL),
    });

    if(!user || !channel) {
      return
    }
    // Проверяем, существует ли уже подписка
    const existingSubscription = await this.db
      .select(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, user.id),
          eq(subscriptions.channelId, channel.id)
        )
      )
      .execute();

    if (existingSubscription.length > 0) {
      throw new ConflictException('Already subscribed');
    }

    // Создаем новую подписку
    return this.db
      .insert(subscriptions)
      .values({
        userId: user.id,
        channelId: channel.id,
        createdAt: new Date()
      })
      .execute();
  }

  async unsubscribe(userURL: string, channelURL: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.url, userURL),
    });

    const channel = await this.db.query.users.findFirst({
      where: eq(users.url, channelURL),
    });

    if(!user || !channel) {
      return
    }

    const result = await this.db
      .delete(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, user.id),
          eq(subscriptions.channelId, channel.id)
        )
      )
      .execute();

    if (!result) {
      throw new NotFoundException('Subscription not found');
    }

    return result;
  }

  async getSubscriptions(userUrl: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.url, userUrl),
    });

    if(!user) {
      return
    }

    const subscriptionCounts = await this.db
      .select({
        channelId: subscriptions.channelId,
        subscriberCount: sql<number>`count(*)`.as('subscriber_count')
      })
      .from(subscriptions)
      .groupBy(subscriptions.channelId);
  
    return this.db
      .select(subscriptions, {
        channel: {
          id: users.id,
          username: users.firstName,
          avatar: users.avatar,
          subscribersCount: sql<number>`(
            SELECT count(*)
            FROM ${subscriptions}
            WHERE ${subscriptions.channelId} = ${users.id}
          )`.as('subscribers_count')
        }
      })
      .innerJoin(users, eq(users.id, subscriptions.channelId))
      .where(eq(subscriptions.userId, user.id))
      .groupBy(users.id)
      .execute();
  }

  async getSubscribers(channelURL: string) {
    const channel = await this.db.query.users.findFirst({
      where: eq(users.url, channelURL),
    });

    if(!channel) {
      return
    }

    return this.db
      .select(subscriptions, {
        subscriber: {
          id: users.id,
          username: users.url,
          avatar: users.avatar
        }
      })
      .innerJoin(users, eq(users.id, subscriptions.userId))
      .where(eq(subscriptions.channelId, channel.id))
      .execute();
  }

  async checkSubscription(userURL: string, channelURL: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.url, userURL),
    });

    const channel = await this.db.query.users.findFirst({
      where: eq(users.url, channelURL),
    });

    if(!user || !channel) {
      return
    }

    const subscription = await this.db
      .select(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, user.id),
          eq(subscriptions.channelId, channel.id)
        )
      )
      .execute();

    return subscription.length > 0;
  }
}