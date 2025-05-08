import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelSrvice } from './channel.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelSrvice],
})
export class ChannelModule {}
