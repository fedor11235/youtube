import { Injectable, UnauthorizedException, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { DrizzleService } from '../drizzle/drizzle.service';
import { channels, videos } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly drizzleService: DrizzleService,
  ) {}

  async register(registerDto: {
    email: string;
    password: string;
    username: string;
  }) {

    const existingChannel = await this.drizzleService.db
      .select()
      .from(channels)
      .where(eq(channels.email, registerDto.email))
      .limit(1)
      .then(rows => rows[0]);

    if (existingChannel) {
      throw new ConflictException('Channel with this email already exists');
    }

    const hashedPassword = await hash(registerDto.password, 10);
    const url = Date.now().toString();

    const [newChannel] = await this.drizzleService.db.insert(channels).values({
      email: registerDto.email,
      password: hashedPassword,
      username: registerDto.username,
      url,
    }).returning();

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

    const channel = await this.drizzleService.db
      .select()
      .from(channels)
      .where(eq(channels.email, loginDto.email))
      .limit(1)
      .then(rows => rows[0]);

    if (!channel) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(loginDto.password, channel.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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
      const channel = await this.drizzleService.db
        .select()
        .from(channels)
        .where(eq(channels.id, channelId))
        .limit(1)
        .then(rows => rows[0]);
      if (!channel) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Logout failed');
    }
  }

  async getCurrentChannel(channelId: number) {
    const [result] = await this.drizzleService.db
    .select({
      id: channels.id,
      email: channels.email,
      username: channels.username,
      createdAt: channels.createdAt,
      avatar: channels.avatar,
      banner: channels.banner,
      url: channels.url,
      description: channels.description,
      isModel: channels.isModel
    })
    .from(channels)
    .where(eq(channels.id, channelId));

  if (!result) {
    throw new NotFoundException('Пользователь не найден');
  }

  return result;
  }
}