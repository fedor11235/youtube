import { Controller, Post, Request, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StudioService } from './studio.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('studio')
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Post('upload/passport')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('passport', {
      storage: diskStorage({
        destination: './uploads/passports',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(new Error('Только изображения формата JPG и PNG'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadPassport(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    return this.studioService.processPassport(req.user.id, file);
  }
}