import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { channels } from '../../database/schema';
import { eq, ilike, or } from 'drizzle-orm';

@Injectable()
export class ChannelSrvice {
  constructor(private readonly drizzleService: DrizzleService) {}

  async findById(id: string) {
    const [channel] = await this.drizzleService.db
      .select({
          id: channels.id,
          email: channels.email,
          username: channels.username,
          avatar: channels.avatar,
          banner: channels.banner,
          isModel: channels.isModel,
          createdAt: channels.createdAt,
          url: channels.url
      })
      .from(channels)
      .where(eq(channels.url, id));

    if (!channel) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return channel;
  }

  async searchChannels(query: string) {
    const searchQuery = `%${query}%`;
    
    const result = await this.drizzleService.db
      .select({
        id: channels.id,
        email: channels.email,
        username: channels.username,
        avatar: channels.avatar,
        url: channels.url,
        createdAt: channels.createdAt
      })
      .from(channels)
      .where(
        or(
          ilike(channels.username, searchQuery),
          ilike(channels.email, searchQuery)
        )
      )
      .limit(20)
      .execute();

    return result;
  }
}