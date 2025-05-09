import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './modules/drizzle/drizzle.module';
import { AuthModule } from './modules/auth/auth.module';
import { VideoModule } from './modules/video/video.module';
import { FileModule } from './modules/file/file.module';
import { ChannelModule } from './modules/channel/channel.module';
import { VideoHistoryModule } from './modules/video-history/video-history.module';
import { VideoLikesModule } from './modules/video-likes/video-likes.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { CommentModule } from './modules/comment/comment.module';
import { CommentLikesModule } from './modules/comment-likes/comment-likes.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { VideoViewsModule } from './modules/video-views/video-views.module';
import { NotificationModule } from './modules/notification/notification.module';
import { StudioModule } from './modules/studio/studio.module';
import { TagModule } from './modules/tag/tag.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
    AuthModule,
    VideoModule,
    FileModule,
    ChannelModule,
    SubscriptionModule,
    VideoHistoryModule,
    VideoLikesModule,
    CommentModule,
    CommentLikesModule,
    FavoritesModule,
    VideoViewsModule,
    NotificationModule,
    TagModule,
    StudioModule,
    OrdersModule
  ],
})
export class AppModule {}