import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { channels, videos } from '../../database/schema';
import { eq, ilike, or } from 'drizzle-orm';
import * as path from 'path';
import { promises as fs } from 'fs';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ChannelSrvice {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getProfile(channelId: number) {
    const result = await this.drizzleService.db
    .select({
      channel: {
        id: channels.id,
        email: channels.email,
        username: channels.username,
        createdAt: channels.createdAt,
        avatar: channels.avatar,
        banner: channels.banner,
        url: channels.url,
        description: channels.description,
        isModel: channels.isModel
      },
      videos: {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        createdAt: videos.createdAt,
        views: videos.views
      }
    })
      .from(channels)
      .leftJoin(videos, eq(videos.channelId, channels.id))
      .where(eq(channels.id, channelId));

    if (!result.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    const channelVideos = result
      .filter(row => row?.videos?.id !== null)
      .map(row => row.videos)
      .sort((a, b) => b!.createdAt.getTime() - a!.createdAt.getTime());

    return {
      ...result[0].channel,
      videos: channelVideos
    };
  }

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
          description: channels.description,
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
        description: channels.description,
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