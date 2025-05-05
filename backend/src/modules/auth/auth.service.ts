import { Injectable, UnauthorizedException, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { DrizzleService } from '../drizzle/drizzle.service';
import { User, users, videos } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class AuthService {
  userRepository: any;
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: DrizzleService,
  ) {}

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const updatedUser = await this.db
      .update(users)
      .set(updateProfileDto)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedUser[0];
  }

  async updateAvatar(userId: number, file: Express.Multer.File) {
    // Создаем директорию для аватаров, если её нет
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');

    await fs.mkdir(uploadDir, { recursive: true });

    // Генерируем уникальное имя файла
    const fileExt = path.extname(file.originalname);
    const fileName = `avatar-${userId}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Сохраняем файл
    await fs.writeFile(filePath, file.buffer);

    // Обновляем запись в базе данных
    const updatedUser = await this.db
      .update(users)
      .set({ avatar: fileName })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedUser[0];
  }

  async register(registerDto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country?: string;
    city?: string;
  }) {
    // Check if user exists
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, registerDto.email),
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hash(registerDto.password, 10);

    // Create new user
    const [newUser] = await this.db.insert(users).values({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      country: registerDto.country,
      city: registerDto.city,
    }).returning();

    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: newUser.id,
      email: newUser.email 
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        country: newUser.country,
        city: newUser.city,
        createdAt: newUser.createdAt,
        avatar: newUser.avatar
      },
      token,
    };
  }

  async login(loginDto: { email: string; password: string }) {
    // Find user
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, loginDto.email),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: user.id,
      email: user.email 
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        city: user.city,
        createdAt: user.createdAt,
        avatar: user.avatar
      },
      token,
    };
  }

  async logout(userId: number) {
    try {
      const user = await this.db.query.users.findFirst({ where:  eq(users.id, userId) });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // You might want to invalidate tokens or perform other cleanup here
    } catch (error) {
      throw new InternalServerErrorException('Logout failed');
    }
  }

  async getCurrentUser(userId: number) {
    const result = await this.db
    .select(users, {
      user: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        country: users.country,
        city: users.city,
        createdAt: users.createdAt,
        avatar: users.avatar,
        banner: users.banner,
        url: users.url
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
    .leftJoin(videos, eq(videos.userId, users.id))
    .where(eq(users.id, userId));

  if (!result.length) {
    throw new NotFoundException('Пользователь не найден');
  }

  // Преобразуем результат в нужный формат
  const userVideos = result
    .filter(row => row.videos.id !== null)
    .map(row => row.videos)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    ...result[0].user,
    videos: userVideos
  };
  }

  async updateBanner(userId: number,  file: Express.Multer.File) {
    // Создаем директорию для аватаров, если её нет
    const uploadDir = path.join(process.cwd(), 'uploads', 'banners');

    await fs.mkdir(uploadDir, { recursive: true });

    // Генерируем уникальное имя файла
    const fileExt = path.extname(file.originalname);
    const fileName = `banner-${userId}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Сохраняем файл
    await fs.writeFile(filePath, file.buffer);

    // Обновляем запись в базе данных
    const updatedUser = await this.db
      .update(users)
      .set({ banner: fileName })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser.length) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updatedUser[0];
  }
}