import type { Channel } from "./channel";

export interface Video {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration: number;
  views: number;
  createdAt: string;
  channel: Channel;
}

export interface LibraryVideo extends Video {
  watchedAt?: string;
  addedAt?: string;
}

export interface VideoUpload {
  title: string;
  description: string;
  videoFile: File;
  thumbnailFile?: File;
}

export interface VideoComment {
  id: number;
  content: string;
  createdAt: string;
  channelId: number;
  videoId: number;
  channel: {
    id: number;
    avatar?: string;
  };
}