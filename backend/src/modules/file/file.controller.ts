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
  @Get('upload/:filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', 'avatars', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Файл не найден');
    }

    res.sendFile(filePath);
  }

  // @Post('upload')
  // async getFile(@Body() body, @Res() res: Response) {
  //   const { fileName } = body;

  //   const filePath = path.join(process.cwd(), fileName);
  
  //   if (!fs.existsSync(filePath)) {
  //     throw new NotFoundException('Файл не найден');
  //   }

  //   res.sendFile(filePath);
  // }
}
