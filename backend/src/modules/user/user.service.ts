import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { channels } from '../../database/schema';
import { eq, ilike, or } from 'drizzle-orm';

@Injectable()
export class UsereSrvice {
  constructor(private readonly db: DrizzleService) {}

  async findById(id: string) {
    const result = await this.db
      .select(channels)
      .where(eq(channels.url, id));

    if (!result.length) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    const user = result[0];
    delete user.password;

    return user;
  }

  async searchUsers(query: string) {
    const searchQuery = `%${query}%`;
    
    const result = await this.db
      .select(channels, {
        id: channels.id,
        email: channels.email,
        username: channels.username,
        avatar: channels.avatar,
        url: channels.url,
        createdAt: channels.createdAt
      })
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