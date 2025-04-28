import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('files')
export class FilesController {
  @Get('avatar/:filename')
  async getAvatar(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', 'avatars', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Файл не найден');
    }

    res.sendFile(filePath);
  }


  @Get('thumbnails/:filename')
  async getThumbnails(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', 'thumbnails', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Файл не найден');
    }

    res.sendFile(filePath);
  }

  @Get('videos/:filename')
  async getVideo(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', 'videos', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Файл не найден');
    }

    res.sendFile(filePath);
  }
}
