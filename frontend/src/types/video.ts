export interface Channel {
  id: number;
  name: string;
  avatar: string;
  subscribers: number;
}

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
  userId: number;
  channel: Channel;
  duration: number;
  user: {
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
  userId: number;
  videoId: number;
  user: {
    id: number;
    avatar?: string;
  };
}