import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { tags, videoTags, type Tag } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TagService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getTags(): Promise<Tag[]> {
    return this.drizzleService.db.select().from(tags);
  }

  async getTagById(id: number): Promise<Tag> {
    const result = await this.drizzleService.db
      .select()
      .from(tags)
      .where(eq(tags.id, id));

    if (!result.length) {
      throw new NotFoundException(`Тег с ID ${id} не найден`);
    }

    return result[0];
  }

  async getVideoTags(videoId: number): Promise<Tag[]> {
    const result = await this.drizzleService.db
      .select({
        id: tags.id,
        name: tags.name,
      })
      .from(videoTags)
      .innerJoin(tags, eq(videoTags.tagId, tags.id))
      .where(eq(videoTags.videoId, videoId));

    return result;
  }
}