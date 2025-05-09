import { Controller, Post, Body } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbacksService: FeedbackService) {}

  @Post('submit')
  async submitOrder(@Body() feedbackData: any) {
    return this.feedbacksService.procesFeedback(feedbackData);
  }
}