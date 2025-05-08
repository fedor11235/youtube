import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../database/schema';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  [x: string]: any;
  private pool: Pool;
  public db: ReturnType<typeof drizzle<typeof schema>>;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'video_hosting',
    });

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleInit() {
    // Test the connection
    try {
      await this.pool.connect();
      console.log('Database connection established');
    } catch (err) {
      console.error('Failed to connect to database:', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}