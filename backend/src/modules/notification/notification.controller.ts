import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getChannelNotifications(@Request() req) {
    return this.notificationService.getChannelNotifications(req.channel.id);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    await this.notificationService.markAsRead(+id, req.channel.id);
    return { success: true };
  }

  @Post('read-all')
  async markAllAsRead(@Request() req) {
    await this.notificationService.markAllAsRead(req.channel.id);
    return { success: true };
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req) {
    await this.notificationService.deleteNotification(+id, req.channel.id);
    return { success: true };
  }

  @Delete()
  async deleteAllNotifications(@Request() req) {
    await this.notificationService.deleteAllNotifications(req.channel.id);
    return { success: true };
  }
}