import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    try {
      const channel = await this.authService.updateProfile(req.user.id, updateProfileDto);
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
      const channel = await this.authService.updateAvatar(req.user.id, file);
      return channel;
    } catch (error) {
      throw new HttpException('Failed to update avatar', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('banner')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  async uploadBanner(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const channel = this.authService.updateBanner(req.user.id, file);
    return channel;
  }
}