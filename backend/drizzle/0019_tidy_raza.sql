ALTER TABLE "users" RENAME TO "channels";--> statement-breakpoint
ALTER TABLE "channels" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "channels" DROP CONSTRAINT "users_url_unique";--> statement-breakpoint
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_channel_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "video_history" DROP CONSTRAINT "video_history_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "video_likes" DROP CONSTRAINT "video_likes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "video_views" DROP CONSTRAINT "video_views_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "videos" DROP CONSTRAINT "videos_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_user_id_channels_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_channels_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_channels_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_channels_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_channels_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_channels_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_history" ADD CONSTRAINT "video_history_user_id_channels_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_likes" ADD CONSTRAINT "video_likes_user_id_channels_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_views" ADD CONSTRAINT "video_views_user_id_channels_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_user_id_channels_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channels" ADD CONSTRAINT "channels_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "channels" ADD CONSTRAINT "channels_url_unique" UNIQUE("url");