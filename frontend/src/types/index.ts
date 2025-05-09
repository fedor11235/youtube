export interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  data: {
    videoId?: number,
    channel: Channel
  };
  read: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Channel {
  id: number;
  name: string;
  avatar: string;
  banner: string;
  subscribers: number;
  username: string;
  email: string;
  url: string;
  createdAt: string;
  totalViews: number;
  videosCount: number;
  subscribersCount: number;
}

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

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  channel: Channel;
  likes?: number;
  dislikes?: number;
}

export interface LibraryVideo extends Video {
  watchedAt?: string;
  addedAt?: string;
}
