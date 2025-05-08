import type { Video } from './index'

export interface Profile {
  id: number;
  email: string;
  username: string;
  avatar: string;
  subscribers: number;
  totalViews: number;
  joinDate: Date;
  url: string;
  banner: string;
  videos: Video[];
}