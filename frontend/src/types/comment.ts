import type { Channel } from "./channel";

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  channel: Channel;
  likes?: number;
  dislikes?: number;
}
