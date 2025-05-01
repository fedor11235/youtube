import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './modules/drizzle/drizzle.module';
import { AuthModule } from './modules/auth/auth.module';
import { VideoModule } from './modules/video/video.module';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/user/user.module';
import { VideoHistoryModule } from './modules/video-history/video-history.module';
import { VideoLikesModule } from './modules/video-likes/video-likes.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { CommentModule } from './modules/comment/comment.module';
import { CommentLikesModule } from './modules/comment-likes/comment-likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
    AuthModule,
    VideoModule,
    FileModule,
    UserModule,
    SubscriptionModule,
    VideoHistoryModule,
    VideoLikesModule,
    CommentModule,
    CommentLikesModule
  ],
})
export class AppModule {}