import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new channel' })
  @ApiResponse({ status: 201, description: 'Channel successfully registered' })
  @ApiResponse({ status: 409, description: 'Channel already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Channel login' })
  @ApiResponse({ status: 200, description: 'Channel successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    try {
      await this.authService.logout(req.user.id);
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new HttpException('Logout failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentChannel(@Req() req) {
    try {
      const channel = await this.authService.getCurrentChannel(req.user.id);
      return channel;
    } catch (error) {
      throw new HttpException('Failed to get channel profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}