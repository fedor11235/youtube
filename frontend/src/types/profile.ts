import type { Video } from './index'

export interface Profile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  country: string;
  city: string;
  subscribers: number;
  totalViews: number;
  joinDate: Date;
  url: string;
  banner: string;
  videos: Video[];
}