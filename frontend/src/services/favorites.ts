import { api } from 'src/boot/axios';

export const favoritesService = {
  async addToFavorites(videoId: number) {
    const response = await api.post(`/favorites/${videoId}`);
    return response.data;
  },

  async removeFromFavorites(videoId: number) {
    const response = await api.delete(`/favorites/${videoId}`);
    return response.data;
  },

  async getFavorites() {
    const response = await api.get('/favorites');
    return response.data;
  },

  async checkFavorite(videoId: number) {
    const response = await api.get(`/favorites/${videoId}/check`);
    return response.data;
  }
};