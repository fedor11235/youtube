import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, channel: any, info: any) {
    // В отличие от стандартного JwtAuthGuard, этот guard не выбрасывает ошибку
    // если токен отсутствует или недействителен
    if (err || !channel) {
      return null; // Возвращаем null вместо ошибки
    }
    return channel;
  }

  async canActivate(context: ExecutionContext) {
    try {
      // Пытаемся выполнить аутентификацию
      const result = (await super.canActivate(context)) as boolean;
      return result;
    } catch (err) {
      // В случае ошибки аутентификации разрешаем доступ
      return true;
    }
  }
}