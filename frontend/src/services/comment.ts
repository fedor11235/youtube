import { api } from 'src/boot/axios';
import type { Channel } from 'src/types/channel';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  authorLiked: boolean;
  isCreatorLike: boolean;
  replies: Comment[];
  channel: Channel;
}

export const commentService = {
  async createReply(parentId: number, content: string): Promise<Comment> {
    const { data } = await api.post<Comment>(`/comments/${parentId}/replies`, {
      content
    });
    return data;
  },

  async createComment(videoId: number, content: string) {
    const response = await api.post(`/comments/video/${videoId}`, { content });
    return response.data;
  },

  async getVideoComments(videoId: number) {
    const response = await api.get<Comment[]>(`/comments/video/${videoId}`);
    return response.data;
  },

  async updateComment(commentId: number, content: string) {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  async deleteComment(commentId: number) {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
};