import { api } from 'src/boot/axios';

interface HistoryEntry {
  id: number;
  watchedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  video: any;
}

export const videoHistoryService = {
  async addToHistory(videoId: number) {
    const response = await api.post(`/video-history/${videoId}`);
    return response.data;
  },

  async getHistory(): Promise<HistoryEntry[]> {
    const response = await api.get('/video-history');
    return response.data;
  },

  async clearHistory() {
    const response = await api.delete('/video-history');
    return response.data;
  }
};