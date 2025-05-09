import { Controller, Post, Delete, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionService } from './subscription.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @ApiOperation({ summary: 'Get channel subscriptions' })
  async getSubscriptions(@Req() req) {
    return this.subscriptionService.getSubscriptions(req.user.id);
  }


  @Post(':channelId')
  @ApiOperation({ summary: 'Subscribe to channel' })
  async subscribe(@Req() req, @Param('channelId') channelId: string) {
    return this.subscriptionService.subscribe(req.user.id, channelId);
  }

  @Delete(':channelId')
  @ApiOperation({ summary: 'Unsubscribe from channel' })
  async unsubscribe(@Req() req, @Param('channelId') channelId: string) {
    return this.subscriptionService.unsubscribe(req.user.id, channelId);
  }

  @Get('subscribers/:channelId')
  @ApiOperation({ summary: 'Get channel subscribers' })
  async getSubscribers(@Param('channelId') channelId: string) {
    return this.subscriptionService.getSubscribers(channelId);
  }

  @Get('check/:channelId')
  @ApiOperation({ summary: 'Check subscription status' })
  async checkSubscription(@Req() req, @Param('channelId') channelId: string) {
    const isSubscribed = await this.subscriptionService.checkSubscription(
      req.user.id,
      channelId
    );
    return { isSubscribed };
  }
}