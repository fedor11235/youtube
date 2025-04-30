ALTER TABLE "comments" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "video_likes" DROP COLUMN "updated_at";