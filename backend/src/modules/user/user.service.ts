import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { users } from '../../database/schema';
import { eq, ilike, or } from 'drizzle-orm';

@Injectable()
export class UsereSrvice {
  constructor(private readonly db: DrizzleService) {}

  async findById(id: string) {
    const result = await this.db
      .select(users)
      .where(eq(users.url, id));

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
      .select(users, {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar,
        url: users.url,
        createdAt: users.createdAt
      })
      .where(
        or(
          ilike(users.firstName, searchQuery),
          ilike(users.lastName, searchQuery),
          ilike(users.email, searchQuery)
        )
      )
      .limit(20)
      .execute();

    return result;
  }
}