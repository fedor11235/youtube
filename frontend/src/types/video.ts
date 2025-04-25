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
  createdAt: Date;
  userId: number;
  channel: Channel;
  duration: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
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
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}