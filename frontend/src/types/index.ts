export interface User {
  id: number;
  name: string;
  firstName?: string;
  avatar: string;
  subscribers?: number;
}

export interface Channel {
  id: number;
  name: string;
  avatar: string;
  subscribers: number;
  firstName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  url?: any;
}
 
export interface Channel {
  id: number;
  name: string;
  avatar: string;
  subscribers: number;
}

export interface Video {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration: number;
  views: number;
  createdAt: Date;
  channel: Channel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  user: User;
  likes?: number;
  dislikes?: number;
}

export interface LibraryVideo extends Video {
  watchedAt?: Date;
  addedAt?: Date;
}
