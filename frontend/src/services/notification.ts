import { api } from 'src/boot/axios';
import type { Notification } from 'src/types/notification';

class NotificationService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: ((notification: Notification) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.ws = new WebSocket(`ws://${window.location.host}/api/notifications?token=${token}`);

    this.ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.notifyListeners(notification);
    };

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, 1000 * Math.pow(2, this.reconnectAttempts));
      }
    };
  }

  subscribe(callback: (notification: Notification) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(notification: Notification) {
    this.listeners.forEach(listener => listener(notification));
  }

  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get<Notification[]>('/notifications');
    return data;
  }

  async markAsRead(notificationId: number): Promise<void> {
    await api.post(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  }
}

export default new NotificationService();