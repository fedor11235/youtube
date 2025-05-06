import { api } from 'src/boot/axios';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  authorLiked: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isCreatorLike?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  replies?: any;
  user: {
    id: number;
    username: string;
    avatar: string;
    url: string;
  };
}

export const commentService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createReply(parentId: number, content: string): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await api.post<any>(`/comments/${parentId}/replies`, {
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