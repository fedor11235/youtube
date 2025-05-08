export interface VideoUpload {
  title: string;
  description: string;
  videoFile: File;
  thumbnailFile: File | null;
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