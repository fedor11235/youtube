import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { tags, channels, videoLikes, videos, videoTags, videoViews, Video } from '../../database/schema';
import { desc, eq, gte, inArray, like, ne, or, sql } from 'drizzle-orm';
import { extractDuration, extractThumbnail, editVideo } from './video.utils';
import { subDays } from 'date-fns';

@Injectable()
export class VideoService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async createVideo(file: Express.Multer.File, createVideoDto: any, channelId: number) {
    const test = await editVideo(file.path);
    const thumbnailUrl = await extractThumbnail(file.path);
    const duration = await extractDuration(file.path);

    const [video] = await this.drizzleService.db.insert(videos).values({
      title: createVideoDto.title,
      description: createVideoDto.description,
      videoUrl: file.filename,
      thumbnailUrl,
      channelId: channelId,
      duration
    }).returning();
  
    return video;
  }

  async getAllVideos() {
    //const test = this.drizzleService.db.select(videos)
    const result = await this.drizzleService.db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        createdAt: videos.createdAt,
        duration: videos.duration,
        channel: {
          id: channels.id,
          username: channels.username,
          email: channels.email,
          avatar: channels.avatar,
          url: channels.url
        }
      })
      .from(videos)
      .leftJoin(channels, eq(videos.channelId, channels.id));
  
    return result.map((video) => ({
      ...video,
      channel: {
        id: video.channel!.id,
        username: video.channel!.username,
        avatar: video.channel!.avatar || null,
        url: video.channel!.url
      },
    }));
  }

  async getVideoById(id: number) {
    const video = await this.drizzleService.db.select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        createdAt: videos.createdAt,
        duration: videos.duration,
        channel: {
          id: channels.id,
          username: channels.username,
          email: channels.email,
          avatar: channels.avatar,
          url: channels.url
        }
      })
      .from(videos)
      .where(eq(videos.id, id))
      .leftJoin(channels, eq(videos.channelId, channels.id))
      .limit(1);

    if (!video.length) {
      throw new NotFoundException('Video not found');
    }

    return video[0];
  }

  async deleteVideo(id: number, channelId: number) {
    const video = await this.drizzleService.db.select()
      .from(videos)
      .where(eq(videos.id, id))
      .limit(1);
  
    if (!video.length) {
      throw new NotFoundException('Видео не найдено');
    }
  
    if (video[0].channelId !== channelId) {
      throw new UnauthorizedException('У вас нет прав на удаление этого видео');
    }
  
    await this.drizzleService.db.delete(videos)
      .where(eq(videos.id, id));
  
    return { success: true };
  }

  async getChannelVideos(channelId: number) {
    const videosChannel = await this.drizzleService.db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        createdAt: videos.createdAt,
        channelId: videos.channelId,
        duration: videos.duration,
        channel: {
          id: channels.id,
          username: channels.username,
          avatar: channels.avatar
        }
      })
      .from(videos)
      .innerJoin(channels, eq(channels.id, videos.channelId))
      .where(eq(videos.channelId, channelId))
      .orderBy(desc(videos.createdAt));
  
    return {
      videosChannel,
      total: videosChannel.length
    };
  }

  async getLikedVideos(userId: number) {
    return this.drizzleService.db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        createdAt: videos.createdAt,
        viewsCount: videos.views,
        duration: videos.duration,
        channel: {
          id: channels.id,
          username: channels.username,
          avatar: channels.avatar
        }
      })
      .from(videoLikes)
      .innerJoin(videos, eq(videoLikes.videoId, videos.id))
      .innerJoin(channels, eq(videos.channelId, channels.id))
      .where(eq(videoLikes.channelId, userId))
      .orderBy(desc(videoLikes.createdAt))
      .execute();
  }

  async getTrendingVideos() {
    const yesterday = subDays(new Date(), 1);
    
    return this.drizzleService.db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        createdAt: videos.createdAt,
        views: sql`COUNT(${videoViews.id})`,
        duration: videos.duration,
        channel: {
          id: channels.id,
          username: channels.username,
          avatar: channels.avatar,
          url: channels.url
        }
      })
      .from(videos)
      .leftJoin(channels, eq(videos.channelId, channels.id))
      .leftJoin(videoViews, eq(videos.id, videoViews.videoId))
      .where(
          gte(videoViews.createdAt, yesterday)
      )
      .groupBy(videos.id, channels.id)
      .orderBy(desc(sql`COUNT(${videoViews.id})`))
      .limit(10);
  }

  async getRelatedVideos(id: number) {
    const result = await this.drizzleService.db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        createdAt: videos.createdAt,
        duration: videos.duration,
        channel: {
          id: channels.id,
          username: channels.username,
          email: channels.email,
          avatar: channels.avatar,
          url: channels.url
        }
      })
      .from(videos)
      .leftJoin(channels, eq(videos.channelId, channels.id))
      .where(ne(videos.id, id)); // Добавляем условие для исключения текущего видео

    return result.map(video => ({
      ...video,
      channel: {
        id: video.channel!.id,
        username: video.channel!.username,
        avatar: video.channel!.avatar,
        url: video.channel!.url
      },
      user: undefined // удаляем исходные данные пользователя
    }));
  }

  async searchVideos(query: string, tagNames: string[] = []) {
    let videosQuery: any = this.drizzleService.db
      .selectDistinct({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        views: videos.views,
        createdAt: videos.createdAt,
        duration: videos.duration,
        channel: {
          id: channels.id,
          username: channels.username,
          avatar: channels.avatar,
          url: channels.url
        }
      })
      .from(videos)
      .leftJoin(channels, eq(videos.channelId, channels.id));
    
    if (query) {
      videosQuery = videosQuery.where(
        or(
          like(videos.title, `%${query}%`),
          like(videos.description, `%${query}%`),
          like(channels.username, `%${query}%`)
        )
      );
    }
  
    if (tagNames.length > 0) {
      videosQuery = videosQuery
        .innerJoin(videoTags, eq(videos.id, videoTags.videoId))
        .innerJoin(tags, eq(videoTags.tagId, tags.id))
        .where(inArray(tags.name, tagNames))
        .groupBy(videos.id, channels.id, channels.username, channels.avatar, channels.url);
    }
  
    const result = await videosQuery;
  
    return result.map(video => ({
      ...video,
      channel: {
        id: video.channel.id,
        name: video.channel.username,
        avatar: video.channel.avatar,
        url: video.channel.url
      },
      user: undefined
    }));
  }

  async addVideoTags(videoId: number, tagNames: string[]): Promise<void> {
    // Получаем или создаем теги
    const tagPromises = tagNames.map(async (name) => {
      const [existingTag] = await this.drizzleService.db
        .select()
        .from(tags)
        .where(eq(tags.name, name));
  
      if (existingTag) {
        return existingTag;
      }
  
      const [newTag] = await this.drizzleService.db
        .insert(tags)
        .values({ name })
        .returning();
  
      return newTag;
    });
  
    const resolvedTags = await Promise.all(tagPromises);
  
    // Добавляем связи между видео и тегами
    await Promise.all(
      resolvedTags.map((tag) =>
        this.drizzleService.db
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
    const updatedVideo = await this.drizzleService.db
      .update(videos)
      .set({ thumbnailUrl: file.filename })
      .where(eq(videos.id, videoId))
      .returning();

    if (!updatedVideo.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedVideo[0];
  }
}

