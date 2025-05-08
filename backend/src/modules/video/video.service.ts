import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { tags, users, videoLikes, videos, videoTags, videoViews } from '../../database/schema';
import { desc, eq, gte, inArray, like, ne, or, sql } from 'drizzle-orm';
import { extractDuration, extractThumbnail, editVideo } from './video.utils';
import { subDays } from 'date-fns';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class VideoService {
  constructor(private readonly db: DrizzleService) {}

  async createVideo(file: Express.Multer.File, createVideoDto: any, userId: number) {
    const test = await editVideo(file.path);
    const thumbnailUrl = await extractThumbnail(file.path);
    const duration = await extractDuration(file.path);

    const [video] = await this.db.insert(videos).values({
      title: createVideoDto.title,
      description: createVideoDto.description,
      videoUrl: file.filename,
      thumbnailUrl,
      userId: userId,
      duration
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
        duration: videos.duration,
        user: {
          id: users.id,
          username: users.username,
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
        username: video.user.username,
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
        duration: videos.duration,
        user: {
          id: users.id,
          username: users.username,
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
        duration: videos.duration,
        channel: {
          id: users.id,
          username: users.username,
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
        duration: videos.duration,
        user: {
          id: users.id,
          username: users.username,
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
        duration: videos.duration,
        user: {
          id: users.id,
          username: users.username,
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

  async getRelatedVideos(id: number) {
    const result = await this.db
      .select(videos, {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        createdAt: videos.createdAt,
        duration: videos.duration,
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
          avatar: users.avatar,
          url: users.url
        }
      })
      .leftJoin(users, eq(videos.userId, users.id))
      .where(ne(videos.id, id)); // Добавляем условие для исключения текущего видео

    return result.map(video => ({
      ...video,
      channel: {
        id: video.user.id,
        username: video.user.username,
        avatar: video.user.avatar || null,
        url: video.user.url
      },
      user: undefined // удаляем исходные данные пользователя
    }));
  }

  async searchVideos(query: string, tagNames: string[] = []) {
    let videosQuery = this.db
      .selectDistinct(videos, {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        createdAt: videos.createdAt,
        duration: videos.duration,
        user: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
          url: users.url
        }
      })
      .leftJoin(users, eq(videos.userId, users.id));
  
    if (query) {
      videosQuery = videosQuery.where(
        or(
          like(videos.title, `%${query}%`),
          like(videos.description, `%${query}%`),
          like(users.username, `%${query}%`)
        )
      );
    }
  
    if (tagNames.length > 0) {
      videosQuery = videosQuery
        .innerJoin(videoTags, eq(videos.id, videoTags.videoId))
        .innerJoin(tags, eq(videoTags.tagId, tags.id))
        .where(inArray(tags.name, tagNames))
        .groupBy(videos.id, users.id, users.username, users.avatar, users.url);
    }
  
    const result = await videosQuery;
  
    return result.map(video => ({
      ...video,
      channel: {
        id: video.user.id,
        name: video.user.username,
        avatar: video.user.avatar || null,
        url: video.user.url
      },
      user: undefined
    }));
  }

  async addVideoTags(videoId: number, tagNames: string[]): Promise<void> {
    // Получаем или создаем теги
    const tagPromises = tagNames.map(async (name) => {
      const [existingTag] = await this.db
        .select(tags)
        .where(eq(tags.name, name));
  
      if (existingTag) {
        return existingTag;
      }
  
      const [newTag] = await this.db
        .insert(tags)
        .values({ name })
        .returning();
  
      return newTag;
    });
  
    const resolvedTags = await Promise.all(tagPromises);
  
    // Добавляем связи между видео и тегами
    await Promise.all(
      resolvedTags.map((tag) =>
        this.db
          .insert(videoTags)
          .values({
            videoId,
            tagId: tag.id
          })
          .onConflictDoNothing()
      )
    );
  }

  async updateThumbnail(videoId: any, file: Express.Multer.File) {
    const updatedVideo = await this.db
      .update(videos)
      .set({ thumbnailUrl: file.filename })
      .where(eq(videos.id, videoId))
      .returning();
    console.log("updatedVideo: ", updatedVideo)
    if (!updatedVideo.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedVideo[0];
  }
}

