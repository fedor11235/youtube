import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async procesFeedback(feedbackData: any) {
    await this.mailerService.sendMail({
      to: this.configService.get('ADMIN_EMAIL'),
      subject: `Новая обратная связь: ${feedbackData.subject}`,
      template: 'feedback-notification',
      context: {
        subject: feedbackData.subject,
        type: feedbackData.type,
        contact: feedbackData.contact,
        message: feedbackData.message,
        submissionDate: new Date().toLocaleString('ru-RU'),
      },
    });

    return { success: true };
  }
}