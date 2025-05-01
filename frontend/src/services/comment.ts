import { api } from 'src/boot/axios';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    avatar: string;
    url: string;
  };
}

export const commentService = {
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