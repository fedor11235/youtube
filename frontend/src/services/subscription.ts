import { api } from 'src/boot/axios';

export const subscriptionService = {
  async subscribe(channelId: string) {
    const response = await api.post(`/subscriptions/${channelId}`);
    return response.data;
  },

  async unsubscribe(channelId: string) {
    const response = await api.delete(`/subscriptions/${channelId}`);
    return response.data;
  },

  async getSubscriptions() {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  async getSubscribers(channelId: string) {
    const response = await api.get(`/subscriptions/subscribers/${channelId}`);
    return response.data;
  },

  async checkSubscription(channelId: string) {
    const response = await api.get(`/subscriptions/check/${channelId}`);
    return response.data.isSubscribed;
  },
};
