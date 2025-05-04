import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { users, videoLikes, videos, videoViews } from '../../database/schema';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { extractThumbnail } from './video.utils';
import { subDays } from 'date-fns';

@Injectable()
export class VideoService {
  constructor(private readonly db: DrizzleService) {}

  async createVideo(file: Express.Multer.File, createVideoDto: any, userId: number) {
    const thumbnailUrl = await extractThumbnail(file.path);

    const [video] = await this.db.insert(videos).values({
      title: createVideoDto.title,
      description: createVideoDto.description,
      videoUrl: `/uploads/videos/${file.filename}`,
      thumbnailUrl,
      userId: userId,
    }).returning();
  
    return video;
  }

  async getAllVideos() {
    //const test = this.db.select(videos)
    const result = await this.db
      .select(videos, {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        createdAt: videos.createdAt,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          avatar: users.avatar,
          url: users.url
        }
      })
      .leftJoin(users, eq(videos.userId, users.id));
  
    return result.map(video => ({
      ...video,
      channel: {
        id: video.user.id,
        name: `${video.user.firstName} ${video.user.lastName}`,
        avatar: video.user.avatar || null,
        url: video.user.url
      },
      user: undefined // удаляем исходные данные пользователя
    }));
  }

  async getVideoById(id: number) {
    const video = await this.db.select(videos, {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        createdAt: videos.createdAt,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          avatar: users.avatar,
          url: users.url
        }
      })
      .where(eq(videos.id, id))
      .leftJoin(users, eq(videos.userId, users.id))
      .limit(1);

    if (!video.length) {
      throw new NotFoundException('Video not found');
    }

    return video[0];
  }

  async deleteVideo(id: number, userId: number) {
    const video = await this.db.select(videos)
      .where(eq(videos.id, id))
      .limit(1);
  
    if (!video.length) {
      throw new NotFoundException('Видео не найдено');
    }
  
    if (video[0].userId !== userId) {
      throw new UnauthorizedException('У вас нет прав на удаление этого видео');
    }
  
    await this.db.delete(videos)
      .where(eq(videos.id, id));
  
    return { success: true };
  }

  async getChannelVideos(channelId: number) {
    const videosChannel = await this.db
      .select(videos, {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        createdAt: videos.createdAt,
        userId: videos.userId,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          avatar: users.avatar
        }
      })
      .innerJoin(users, eq(users.id, videos.userId))
      .where(eq(videos.userId, channelId))
      .orderBy(desc(videos.createdAt));
  
    return {
      videosChannel,
      total: videosChannel.length
    };
  }

  async getLikedVideos(userId: number) {
    return this.db
      .select(videoLikes, {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        createdAt: videos.createdAt,
        viewsCount: videos.views,
        user: {
          id: users.id,
          username: users.firstName,
          avatar: users.avatar
        }
      })
      .innerJoin(videos, eq(videoLikes.videoId, videos.id))
      .innerJoin(users, eq(videos.userId, users.id))
      .where(eq(videoLikes.userId, userId))
      .orderBy(desc(videoLikes.createdAt))
      .execute();
  }

  async getTrendingVideos() {
    const yesterday = subDays(new Date(), 1);
    
    return this.db
      .select(videos, {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        createdAt: videos.createdAt,
        views: sql`COUNT(${videoViews.id})`,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          avatar: users.avatar,
          url: users.url
        }
      })
      .leftJoin(users, eq(videos.userId, users.id))
      .leftJoin(videoViews, eq(videos.id, videoViews.videoId))
      .where(
          gte(videoViews.createdAt, yesterday)
      )
      .groupBy(videos.id, users.id)
      .orderBy(desc(sql`COUNT(${videoViews.id})`))
      .limit(10);
  }
}

