import { Injectable, UnauthorizedException, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { DrizzleService } from '../drizzle/drizzle.service';
import { User, users } from '../../database/schema';
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
    const user = await this.db.query.users.findFirst({ 
      where:  eq(users.id, userId),
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        country: true,
        city: true,
        createdAt: true,
        avatar: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}