import { Module } from '@nestjs/common';
import { CommentLikesController } from './comment-likes.controller';
import { CommentLikesService } from './comment-likes.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [CommentLikesController],
  providers: [CommentLikesService],
  exports: [CommentLikesService]
})
export class CommentLikesModule {}