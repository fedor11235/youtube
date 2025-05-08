import { io } from 'socket.io-client';
import { api } from 'src/boot/axios';
import type { Notification } from 'src/types/notification';

class NotificationService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private socket: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: any[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.socket = io(`${window.location.protocol}//${window.location.hostname}:3000/notifications`, {
      query: { token }
    });

    this.socket.on('connect', () => {
      console.log('Socket подключен');
    });
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.socket.on('newNotification', (notification: any) => {
      console.log('Получено новое уведомление:', notification);
      this.notifyListeners(notification);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket отключен');
    });

    this.socket.on('connect_error', (error: string) => {
      console.error('Ошибка подключения Socket:', error);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(listener: any): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
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

  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Ошибка при удалении уведомления:', error);
      throw new Error('Не удалось удалить уведомление');
    }
  }
  
  async deleteAllNotifications(): Promise<void> {
    try {
      await api.delete('/notifications');
    } catch (error) {
      console.error('Ошибка при удалении всех уведомлений:', error);
      throw new Error('Не удалось удалить все уведомления');
    }
  }
}

export default new NotificationService();