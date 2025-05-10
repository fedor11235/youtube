-- ALTER TABLE "subscriptions" RENAME COLUMN "subscriber_id" TO "d";--> statement-breakpoint
-- ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_subscriber_id_channels_id_fk";
-- --> statement-breakpoint
-- ALTER TABLE "channels" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
-- ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_d_channels_id_fk" FOREIGN KEY ("d") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "videos" DROP COLUMN "views";--> statement-breakpoint
-- ALTER TABLE "channels" ADD CONSTRAINT "channels_username_unique" UNIQUE("username");
ALTER TABLE "subscriptions" RENAME COLUMN "user_id" TO "subscriber_id";