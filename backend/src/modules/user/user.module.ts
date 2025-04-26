import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UsereSrvice } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UsereSrvice],
})
export class UserModule {}
