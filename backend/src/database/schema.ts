import { pgTable, serial, varchar, timestamp, text, integer, uniqueIndex, boolean, jsonb } from 'drizzle-orm/pg-core';

export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  username: varchar('username', { length: 100 }),
  avatar: varchar('avatar', { length: 255 }),
  banner: varchar('banner', { length: 255 }),
  isModel: boolean('is_model').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  url: varchar('url', { length: 255 }).notNull().unique(),
});

export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  channelId: integer('channel_id').references(() => channels.id),
  videoUrl: varchar('video_url', { length: 255 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  views: integer('views').default(0),
  duration: integer('duration')
});

export const videoTags = pgTable('video_tags', {
  id: serial('id').primaryKey(),
  videoId: integer('video_id').references(() => videos.id, { onDelete: 'cascade' }).notNull(),
  tagId: integer('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
});

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  parentId: integer('parent_id').references(() => comments.id, { onDelete: 'cascade' }),
  channelId: integer('channel_id').references(() => channels.id),
  videoId: integer('video_id').references(() => videos.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  channelId: integer('channel_id').references(() => channels.id),
  videoId: integer('video_id').references(() => videos.id),
  createdAt: timestamp('created_at').defaultNow()
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  channelId: integer('channel_id').references(() => channels.id),
  videoId: integer('video_id').references(() => videos.id),
  createdAt: timestamp('created_at').defaultNow()
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => channels.id, { onDelete: 'cascade' }),
  channelId: integer('channel_id').notNull().references(() => channels.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const videoHistory = pgTable('video_history', {
  id: serial('id').primaryKey(),
  channelId: integer('channel_id').notNull().references(() => channels.id, { onDelete: 'cascade' }),
  videoId: integer('video_id').notNull().references(() => videos.id, { onDelete: 'cascade' }),
  watchedAt: timestamp('watched_at').notNull().defaultNow(),
});

export const videoLikes = pgTable('video_likes', {
  id: serial('id').primaryKey(),
  channelId: integer('channel_id').notNull().references(() => channels.id, { onDelete: 'cascade' }),
  videoId: integer('video_id').notNull().references(() => videos.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const commentLikes = pgTable('comment_likes', {
  id: serial('id').primaryKey(),
  channelId: integer('channel_id').notNull().references(() => channels.id, { onDelete: 'cascade' }),
  commentId: integer('comment_id').notNull().references(() => comments.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  isCreatorLike: boolean('is_creator_like').default(false),
}, (table) => {
  return {
    uniqueUserComment: uniqueIndex('unique_user_comment').on(table.channelId, table.commentId),
  };
});

export const videoViews = pgTable('video_views', {
  id: serial('id').primaryKey(),
  channelId: integer('channel_id').references(() => channels.id),
  videoId: integer('video_id').references(() => videos.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  channelId: integer('channel_id').notNull().references(() => channels.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'video', 'subscription', 'comment', 'system'
  read: boolean('read').default(false),
  link: varchar('link', { length: 255 }),
  data: jsonb('data'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Video = typeof videos.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type VideoLike = typeof videoLikes.$inferSelect;
export type NewVideoLike = typeof videoLikes.$inferInsert;
export type VideoHistory = typeof videoHistory.$inferSelect;
export type NewVideoHistory = typeof videoHistory.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Channel = typeof channels.$inferSelect;
export type NewChannel = typeof channels.$inferInsert;
