import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { users } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsereSrvice {
  constructor(private readonly db: DrizzleService) {}

  async findById(id: number) {
    const result = await this.db
      .select(users)
      .where(eq(users.id, id));

    if (!result.length) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    const user = result[0];
    delete user.password;

    return user;
  }
}