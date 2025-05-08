import { Injectable, UnauthorizedException, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { DrizzleService } from '../drizzle/drizzle.service';
import { channels, videos } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: DrizzleService,
  ) {}

  async updateProfile(channelId: number, updateProfileDto: UpdateProfileDto) {
    const updatedChannel = await this.db
      .update(channels)
      .set(updateProfileDto)
      .where(eq(channels.id, channelId))
      .returning();

    if (!updatedChannel.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedChannel[0];
  }

  async updateAvatar(channelId: number, file: Express.Multer.File) {
    console.log(file)
    // Создаем директорию для аватаров, если её нет
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');

    await fs.mkdir(uploadDir, { recursive: true });

    // Генерируем уникальное имя файла
    const fileExt = path.extname(file.originalname);
    const fileName = `avatar-${channelId}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Сохраняем файл
    await fs.writeFile(filePath, file.buffer);

    // Обновляем запись в базе данных
    const updatedChannel = await this.db
      .update(channels)
      .set({ avatar: fileName })
      .where(eq(channels.id, channelId))
      .returning();

    if (!updatedChannel.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedChannel[0];
  }

  async register(registerDto: {
    email: string;
    password: string;
    username: string;
  }) {
    const existingChannel = await this.db.query.channels.findFirst({
      where: eq(channels.email, registerDto.email),
    });

    if (existingChannel) {
      throw new ConflictException('Channel with this email already exists');
    }

    // Hash password
    const hashedPassword = await hash(registerDto.password, 10);
    const url = new Date()

    const [newChannel] = await this.db.insert(channels).values({
      email: registerDto.email,
      password: hashedPassword,
      username: registerDto.username,
      url,
    }).returning();

    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: newChannel.id,
      email: newChannel.email 
    });

    return {
      channel: {
        id: newChannel.id,
        email: newChannel.email,
        username: newChannel.username,
        createdAt: newChannel.createdAt,
        avatar: newChannel.avatar
      },
      token,
    };
  }

  async login(loginDto: { email: string; password: string }) {
    const channel = await this.db.query.channels.findFirst({
      where: eq(channels.email, loginDto.email),
    });

    if (!channel) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await compare(loginDto.password, channel.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: channel.id,
      email: channel.email 
    });

    return {
      channel: {
        id: channel.id,
        email: channel.email,
        username: channel.username,
        createdAt: channel.createdAt,
        avatar: channel.avatar
      },
      token,
    };
  }

  async logout(channelId: number) {
    try {
      const channel = await this.db.query.channels.findFirst({ where:  eq(channels.id, channelId) });
      if (!channel) {
        throw new NotFoundException('User not found');
      }
      // You might want to invalidate tokens or perform other cleanup here
    } catch (error) {
      throw new InternalServerErrorException('Logout failed');
    }
  }

  async getCurrentChannel(channelId: number) {
    const result = await this.db
    .select(channels, {
      channel: {
        id: channels.id,
        email: channels.email,
        username: channels.username,
        createdAt: channels.createdAt,
        avatar: channels.avatar,
        banner: channels.banner,
        url: channels.url
      },
      videos: {
        id: videos.id,
        title: videos.title,
        description: videos.description,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        createdAt: videos.createdAt,
        views: videos.views
      }
    })
    .leftJoin(videos, eq(videos.channelId, channels.id))
    .where(eq(channels.id, channelId));

  if (!result.length) {
    throw new NotFoundException('Пользователь не найден');
  }

  // Преобразуем результат в нужный формат
  const channelVideos = result
    .filter(row => row.videos.id !== null)
    .map(row => row.videos)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    ...result[0].channel,
    videos: channelVideos
  };
  }

  async updateBanner(channelId: number,  file: Express.Multer.File) {
    // Создаем директорию для аватаров, если её нет
    const uploadDir = path.join(process.cwd(), 'uploads', 'banners');

    await fs.mkdir(uploadDir, { recursive: true });

    // Генерируем уникальное имя файла
    const fileExt = path.extname(file.originalname);
    const fileName = `banner-${channelId}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Сохраняем файл
    await fs.writeFile(filePath, file.buffer);

    // Обновляем запись в базе данных
    const updatedChannel = await this.db
      .update(channels)
      .set({ banner: fileName })
      .where(eq(channels.id, channelId))
      .returning();

    if (!updatedChannel.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedChannel[0];
  }
}