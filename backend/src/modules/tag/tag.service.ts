import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { tags, videoTags, type Tag } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TagService {
  constructor(private readonly db: DrizzleService) {}

  async getTags(): Promise<Tag[]> {
    return this.db.select(tags);
  }

  async getTagById(id: number): Promise<Tag> {
    const result = await this.db
      .select(tags)
      .where(eq(tags.id, id));

    if (!result.length) {
      throw new NotFoundException(`Тег с ID ${id} не найден`);
    }

    return result[0];
  }

  async getVideoTags(videoId: number): Promise<Tag[]> {
    const result = await this.db
      .select(videoTags, {
        id: tags.id,
        name: tags.name,
      })
      .innerJoin(tags, eq(videoTags.tagId, tags.id))
      .where(eq(videoTags.videoId, videoId));

    return result;
  }
}