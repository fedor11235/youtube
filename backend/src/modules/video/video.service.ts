import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { users, videos } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class VideoService {
  constructor(private readonly db: DrizzleService) {}

  async createVideo(file: Express.Multer.File, createVideoDto: any, userId: number) {

    const [video] = await this.db.insert(videos).values({
      title: createVideoDto.title,
      description: createVideoDto.description,
      videoUrl: `/uploads/videos/${file.filename}`,
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
          // avatar: users.avatar
        }
      })
      .leftJoin(users, eq(videos.userId, users.id));
  
    return result.map(video => ({
      ...video,
      channel: {
        id: video.user.id,
        name: `${video.user.firstName} ${video.user.lastName}`,
        avatar: video.user.avatar || null
      },
      user: undefined // удаляем исходные данные пользователя
    }));
  }

  async getVideoById(id: number) {
    const video = await this.db.select(videos)
      .from(videos)
      .where(eq(videos.id, id))
      .limit(1);

    if (!video.length) {
      throw new NotFoundException('Video not found');
    }

    return video[0];
  }
}