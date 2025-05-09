import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChannelSrvice } from './channel.service';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Channels')
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelSrvice: ChannelSrvice) {}

  @Get('search')
  @ApiOperation({ summary: 'Search channels by query' })
  async searchChannels(@Query('query') query: string) {
    return this.channelSrvice.searchChannels(query);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    try {
      const channel = await this.channelSrvice.updateProfile(req.user.id, updateProfileDto);
      return channel;
    } catch (error) {
      throw new HttpException('Failed to update profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    try {
      const channel = await this.channelSrvice.updateAvatar(req.user.id, file);
      return channel;
    } catch (error) {
      throw new HttpException('Failed to update avatar', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('banner')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  async uploadBanner(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const channel = this.channelSrvice.updateBanner(req.user.id, file);
    return channel;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get channel by id' })
  async getChannelById(@Param('id') id: string) {
    return this.channelSrvice.findById(id)
  }
}
