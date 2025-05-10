import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { tags, channels, videoLikes, videos, videoTags, videoViews, Video } from '../../database/schema';
import { desc, eq, gte, inArray, like, ne, or, sql } from 'drizzle-orm';
import { extractDuration, extractThumbnail, editVideo } from './video.utils';
import { subDays } from 'date-fns';
import { PgSelect } from 'drizzle-orm/pg-core';

@Injectable()
export class VideoService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async createVideo(file: Express.Multer.File, createVideoDto, channelId: number) {
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

  // async getAllVideos() {
  //   //const test = this.drizzleService.db.select(videos)
  //   const result = await this.drizzleService.db
  //     .select({
  //       id: videos.id,
  //       title: videos.title,
  //       description: videos.description,
  //       videoUrl: videos.videoUrl,
  //       thumbnailUrl: videos.thumbnailUrl,
  //       views: videos.views,
  //       createdAt: videos.createdAt,
  //       duration: videos.duration,
  //       channel: {
  //         id: channels.id,
  //         username: channels.username,
  //         email: channels.email,
  //         avatar: channels.avatar,
  //         url: channels.url
  //       }
  //     })
  //     .from(videos)
  //     .leftJoin(channels, eq(videos.channelId, channels.id));
  
  //   return result.map((video) => ({
  //     ...video,
  //     channel: {
  //       id: video.channel!.id,
  //       username: video.channel!.username,
  //       avatar: video.channel!.avatar || null,
  //       url: video.channel!.url
  //     },
  //   }));
  // }

  async getVideoById(id: number) {
    const video = await this.drizzleService.db.select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        // views: videos.views,
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
        createdAt: videos.createdAt,
        channelId: videos.channelId,
        duration: videos.duration,
        views: sql<number>`COUNT(video_views.id)`.as('views'),
        channel: {
          id: channels.id,
          username: channels.username,
          avatar: channels.avatar,
        },
      })
      .from(videos)
      .leftJoin(videoViews, eq(videoViews.videoId, videos.id))
      .innerJoin(channels, eq(channels.id, videos.channelId))
      .where(eq(videos.channelId, channelId))
      .groupBy(
        videos.id,
        channels.id
      )
      .orderBy(desc(videos.createdAt));
  
    return {
      videosChannel,
      totalVideo: videosChannel.length
    };
  }  

  async getLikedVideos(channelId: number) {
    return this.drizzleService.db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        createdAt: videos.createdAt,
        // viewsCount: videos.views,
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
      .where(eq(videoLikes.channelId, channelId))
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
      .limit(50);
  }

  async getRelatedVideos(id: number) {
    const result = await this.drizzleService.db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        // views: videos.views,
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
      }
    }));
  }

  async searchVideos(page: string, limit: string, query: string, tagNames: string[] = [], sort: string) {
    const orderByClause = (() => {
      switch (sort) {
        case 'most_viewed':
          return 'views DESC, videos.created_at DESC'
        case 'least_viewed':
          return 'views ASC, videos.created_at DESC'
        case 'oldest':
          return 'videos.created_at ASC'
        case 'newest':
        default:
          return 'videos.created_at DESC'
      }
    })();
  
    const conditions: any[] = [];
  
    if (query) {
      const like = `%${query}%`;
      conditions.push(sql`(videos.title ILIKE ${like} OR videos.description ILIKE ${like} OR channels.username ILIKE ${like})`);
    }
  
    if (tagNames.length > 0) {
      conditions.push(sql`tags.name IN (${sql.join(tagNames, sql`, `)})`);
    }
  
    const whereClause = conditions.length > 0
      ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
      : sql``;
  
    const joinTags = tagNames.length > 0
      ? sql`
          INNER JOIN video_tags ON video_tags.video_id = videos.id
          INNER JOIN tags ON tags.id = video_tags.tag_id
        `
      : sql``;
  
    const offset = (parseInt(page) - 1) * parseInt(limit);
  
    const result = await this.drizzleService.db.execute(sql`
      SELECT 
        videos.id,
        videos.title,
        videos.description,
        videos.video_url AS "videoUrl",
        videos.thumbnail_url AS "thumbnailUrl",
        COUNT(video_views.id)::int AS views,
        videos.created_at AS "createdAt",
        videos.duration,
        channels.id AS "channelId",
        channels.username,
        channels.avatar,
        channels.url
      FROM videos
      LEFT JOIN channels ON videos.channel_id = channels.id
      LEFT JOIN video_views ON video_views.video_id = videos.id
      ${joinTags}
      ${whereClause}
      GROUP BY 
        videos.id,
        channels.id
      ORDER BY ${sql.raw(orderByClause)}
      LIMIT ${sql.raw(limit)} OFFSET ${sql.raw(offset.toString())}
    `);
  
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      videoUrl: row.videoUrl,
      thumbnailUrl: row.thumbnailUrl,
      views: row.views,
      createdAt: row.createdAt,
      duration: row.duration,
      channel: {
        id: row.channelId,
        username: row.username,
        avatar: row.avatar,
        url: row.url,
      },
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

  async updateThumbnail(videoId: number, file: Express.Multer.File) {
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

