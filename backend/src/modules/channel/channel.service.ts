import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { channels } from '../../database/schema';
import { eq, ilike, or } from 'drizzle-orm';
import * as path from 'path';
import { promises as fs } from 'fs';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  async updateBanner(channelId: number,  file: Express.Multer.File) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'banners');

    await fs.mkdir(uploadDir, { recursive: true });

    const fileExt = path.extname(file.originalname);
    const fileName = `banner-${channelId}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    const updatedChannel = await this.drizzleService.db
      .update(channels)
      .set({ banner: fileName })
      .where(eq(channels.id, channelId))
      .returning();

    if (!updatedChannel.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedChannel[0];
  }

  async updateProfile(channelId: number, updateProfileDto: UpdateProfileDto) {
    const updatedChannel = await this.drizzleService.db
      .update(channels)
      .set(updateProfileDto)
      .where(eq(channels.id, channelId))
      .returning();

    if (!updatedChannel.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedChannel[0];
  }

  async updateAvatar(channelId: number, file: Express.Multer.File) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');

    await fs.mkdir(uploadDir, { recursive: true });

    const fileExt = path.extname(file.originalname);
    const fileName = `avatar-${channelId}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    const updatedChannel = await this.drizzleService.db
      .update(channels)
      .set({ avatar: fileName })
      .where(eq(channels.id, channelId))
      .returning();

    if (!updatedChannel.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedChannel[0];
  }
}