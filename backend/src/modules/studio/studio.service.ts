import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { channels } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class StudioService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async processPassport(channelId: number, file: Express.Multer.File) {
    // Здесь можно добавить дополнительную обработку изображения
    // например, проверку на качество, размер и т.д.

    // Обновляем статус верификации в базе данных
    await this.drizzleService.db
      .update(channels)
      .set({
        passportPath: file.path
      })
      .where(eq(channels.id, channelId));

    return {
      status: 'success',
      message: 'Паспорт успешно загружен и отправлен на проверку'
    };
  }
}