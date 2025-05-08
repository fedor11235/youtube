ALTER TABLE "comment_likes" RENAME COLUMN "channelId" TO "channel_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "channelId" TO "channel_id";--> statement-breakpoint
ALTER TABLE "favorites" RENAME COLUMN "channelId" TO "channel_id";--> statement-breakpoint
ALTER TABLE "likes" RENAME COLUMN "channelId" TO "channel_id";--> statement-breakpoint
ALTER TABLE "notifications" RENAME COLUMN "channelId" TO "channel_id";--> statement-breakpoint
ALTER TABLE "video_history" RENAME COLUMN "channelId" TO "channel_id";--> statement-breakpoint
ALTER TABLE "video_likes" RENAME COLUMN "channelId" TO "channel_id";--> statement-breakpoint
ALTER TABLE "video_views" RENAME COLUMN "channelId" TO "channel_id";--> statement-breakpoint
ALTER TABLE "videos" RENAME COLUMN "channelId" TO "channel_id";--> statement-breakpoint
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_channelId_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_channelId_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_channelId_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_channelId_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_channelId_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "video_history" DROP CONSTRAINT "video_history_channelId_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "video_likes" DROP CONSTRAINT "video_likes_channelId_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "video_views" DROP CONSTRAINT "video_views_channelId_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "videos" DROP CONSTRAINT "videos_channelId_channels_id_fk";
--> statement-breakpoint
DROP INDEX "unique_user_comment";--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_history" ADD CONSTRAINT "video_history_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_likes" ADD CONSTRAINT "video_likes_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_views" ADD CONSTRAINT "video_views_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_comment" ON "comment_likes" USING btree ("channel_id","comment_id");