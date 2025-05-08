export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  views: number;
  likes: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
  channelId: number;
  duration: number;
  channel: {
    id: number;
    username: string;
    avatar?: string;
  };
}

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