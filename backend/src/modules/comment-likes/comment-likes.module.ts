import { Module } from '@nestjs/common';
import { CommentLikesController } from './comment-likes.controller';
import { CommentLikesService } from './comment-likes.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    DrizzleModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [CommentLikesController],
  providers: [CommentLikesService],
  exports: [CommentLikesService]
})
export class CommentLikesModule {}