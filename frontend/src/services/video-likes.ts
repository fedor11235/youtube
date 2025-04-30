import { api } from 'src/boot/axios';

export const videoLikesService = {
  async likeVideo(videoId: number) {
    const response = await api.post(`/video-likes/${videoId}`);
    return response.data;
  },

  async unlikeVideo(videoId: number) {
    const response = await api.delete(`/video-likes/${videoId}`);
    return response.data;
  },

  async getLikesCount(videoId: number) {
    const response = await api.get(`/video-likes/${videoId}/count`);
    return response.data;
  },

  async hasUserLiked(videoId: number) {
    const response = await api.get(`/video-likes/${videoId}/has-liked`);
    return response.data.hasLiked;
  }
};