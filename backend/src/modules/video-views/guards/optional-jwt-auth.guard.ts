import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TChannel>(err: Error, channel: TChannel | null) {
    if (err || !channel) {
      return null;
    }
    return channel;
  }

  async canActivate(context: ExecutionContext) {
    try {
      const result = (await super.canActivate(context)) as boolean;
      return result;
    } catch (err) {
      return true;
    }
  }
}