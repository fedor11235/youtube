import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { channels } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StudioService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly drizzleService: DrizzleService
  ) {}

  async processPassport(channelId: number, file: Express.Multer.File) {
    const channel = await this.drizzleService.db
      .select()
      .from(channels)
      .where(eq(channels.id, channelId))
      .limit(1)
      .then(rows => rows[0]);

    await this.mailerService.sendMail({
      to: this.configService.get('ADMIN_EMAIL'),
      subject: 'Новая верификация паспорта',
      template: 'passport-verification',
      context: {
        channelUsername: channel.username,
        channelEmail: channel.email,
        channelId: channel.id,
      },
      attachments: [
        {
          filename: file.originalname,
          path: file.path,
        },
      ],
    });
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