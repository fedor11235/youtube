import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsereSrvice } from './user.service';
import { Controller, Get, Param, Query } from "@nestjs/common"

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsereSrvice) {}

  @Get('search')
  @ApiOperation({ summary: 'Search users by query' })
  async searchUsers(@Query('query') query: string) {
    return this.usersService.searchUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id)
  }
}
