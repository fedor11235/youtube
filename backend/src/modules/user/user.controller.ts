import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsereSrvice } from './user.service';
import { Controller, Get, Param } from "@nestjs/common"

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsereSrvice) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(parseInt(id))
  }
}
