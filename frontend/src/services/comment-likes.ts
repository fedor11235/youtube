import { api } from 'src/boot/axios';

export const commentLikesService = {
  async likeComment(commentId: number) {
    const response = await api.post(`/comment-likes/${commentId}`);
    return response.data;
  },

  async unlikeComment(commentId: number) {
    const response = await api.delete(`/comment-likes/${commentId}`);
    return response.data;
  },

  async getLikesCount(commentId: number) {
    const response = await api.get(`/comment-likes/${commentId}/count`);
    return response.data.count;
  },

  async hasUserLiked(commentId: number) {
    const response = await api.get(`/comment-likes/${commentId}/has-liked`);
    return response.data.hasLiked;
  },

  async checkCreatorLike(commentId: number): Promise<boolean> {
    try {
      const { data } = await api.get<boolean>(`/comments/${commentId}/creator-like`);
      return data;
    } catch (error) {
      console.error('Ошибка при проверке лайка создателя:', error);
      return false;
    }
  }

};