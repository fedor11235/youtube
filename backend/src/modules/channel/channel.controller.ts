import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChannelSrvice } from './channel.service';
import { Controller, Get, Param, Query } from "@nestjs/common"

@ApiTags('Channels')
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelSrvice: ChannelSrvice) {}

  @Get('search')
  @ApiOperation({ summary: 'Search channels by query' })
  async searchChannels(@Query('query') query: string) {
    return this.channelSrvice.searchChannels(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get channel by id' })
  async getChannelById(@Param('id') id: string) {
    return this.channelSrvice.findById(id)
  }
}
