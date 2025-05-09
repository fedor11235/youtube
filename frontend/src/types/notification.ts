import type { Channel } from "./channel";

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