export interface Notification {
  id: number;
  title: string;
  message: string;
  avatar: string;
  read: boolean;
  createdAt: string;
  type: 'like' | 'comment' | 'reply' | 'mention' | 'system';
  data?: {
    videoId?: number;
    commentId?: number;
    channelId?: number;
  };
}