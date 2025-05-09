import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async processOrder(orderData: any) {
    await this.mailerService.sendMail({
      to: this.configService.get('ADMIN_EMAIL'),
      subject: `Новый заказ видео: ${orderData.title}`,
      template: 'order-notification',
      context: {
        title: orderData.title,
        description: orderData.description,
        contact: orderData.contact,
        budget: orderData.budget,
        deadline: new Date(orderData.deadline).toLocaleDateString('ru-RU'),
        submissionDate: new Date().toLocaleString('ru-RU'),
      },
    });

    return { success: true };
  }
}