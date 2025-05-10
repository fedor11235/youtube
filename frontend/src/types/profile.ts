import type { Video } from './video'

export interface Profile {
  id: number;
  email: string;
  username: string;
  avatar: string;
  subscribers: number;
  isModel: boolean;
  // totalViews: number;
  totalVideo: number;
  joinDate: Date;
  url: string;
  banner: string;
  description: string;
  hasPassportPhoto: string;
  videos: Video[];
}