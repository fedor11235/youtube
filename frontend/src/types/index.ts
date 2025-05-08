export interface Channel {
  id: number;
  name: string;
  avatar: string;
  banner: string;
  subscribers: number;
  username: string;
  url: string;
  createdAt?: string;
  totalViews?: number;
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
