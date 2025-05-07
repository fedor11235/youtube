import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications'
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.token as string;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Подписываем клиента на его личный канал
      await client.join(`user_${userId}`);
      console.log(`Клиент подключен: user_${userId}`);
    } catch (error) {
      console.error('Ошибка подключения WebSocket:', error);
      client.disconnect();
    }
  }

  // Метод для отправки уведомления конкретному пользователю
  async sendNotification(userId: number, notification: any) {
    this.server.to(`user_${userId}`).emit('newNotification', notification);
  }

  handleDisconnect(client: Socket) {
    console.log('Клиент отключен');
  }
}