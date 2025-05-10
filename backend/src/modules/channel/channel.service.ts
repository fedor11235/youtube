import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { channels, subscriptions, videos, videoViews } from '../../database/schema';
import { eq, ilike, or, and, sql } from 'drizzle-orm';
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
          isModel: channels.isModel,
          hasPassportPhoto: channels.passportPath
        },
        videos: {
          id: videos.id,
          title: videos.title,
          description: videos.description,
          videoUrl: videos.videoUrl,
          thumbnailUrl: videos.thumbnailUrl,
          createdAt: videos.createdAt
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
  
    // Получаем количество видео
    const [{ count: totalVideos }] = await this.drizzleService.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(videos)
      .where(eq(videos.channelId, channelId))
      .execute();
  
    // Получаем количество подписчиков
    const [{ count: totalSubscribers }] = await this.drizzleService.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(subscriptions)
      .where(eq(subscriptions.channelId, channelId))
      .execute();
  
    return {
      ...result[0].channel,
      totalVideo: Number(totalVideos),
      subscribers: Number(totalSubscribers),
      videos: channelVideos
    };
  }
  

  async findByUrl(url: string) {
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
        url: channels.url,
      })
      .from(channels)
      .where(eq(channels.url, url));
  
    if (!channel) {
      throw new NotFoundException(`Пользователь с URL ${url} не найден`);
    }
  
    // Отдельно считаем totalVideo и totalViews:
    const [{ totalVideo }] = await this.drizzleService.db
      .select({
        totalVideo: sql<number>`COUNT(*)`.as('totalVideo')
      })
      .from(videos)
      .where(eq(videos.channelId, channel.id));
  
    return {
      ...channel,
      totalVideo
    };
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
        banner: channels.banner,
        url: channels.url,
        createdAt: channels.createdAt
      })
      .from(channels)
      .where(
        and(
          eq(channels.isModel, true),
          or(
            ilike(channels.username, searchQuery),
            ilike(channels.email, searchQuery)
          )
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