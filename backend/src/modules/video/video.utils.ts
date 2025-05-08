import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs/promises';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export async function checkFfmpeg(): Promise<boolean> {
  try {
    await execAsync('ffmpeg -version');
    return true;
  } catch (error) {
    console.error('FFmpeg not found. Please install FFmpeg first.');
    return false;
  }
}


export async function editVideo(videoPath: string): Promise<string> {
  const introPath = path.join(process.cwd(), 'media', 'intro.mov');
  const tempOutputPath = videoPath + '.tmp.mp4';

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(introPath)
      .input(videoPath)
      .complexFilter([
        // Масштабируем оба видео до 1280x720 с сохранением пропорций и паддингом
        '[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setdar=16/9[intro_v]',
        '[1:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setdar=16/9[main_v]',
        '[intro_v][0:a][main_v][1:a]concat=n=2:v=1:a=1[outv][outa]'
      ])
      .outputOptions([
        '-map', '[outv]',
        '-map', '[outa]',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'veryfast',
        '-movflags', '+faststart'
      ])
      .on('end', async () => {
        try {
          await fs.unlink(videoPath);
          await fs.rename(tempOutputPath, videoPath);
          console.log('Видео успешно обновлено:', videoPath);
          resolve(videoPath);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        console.error('Ошибка FFmpeg:', err.message);
        reject(err);
      })
      .save(tempOutputPath);
  });
}

export async function extractThumbnail(videoPath: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'uploads', 'thumbnails');
  await fs.mkdir(uploadDir, { recursive: true });
  
  const thumbnailFileName = `thumbnail-${Date.now()}.jpg`;
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['00:00:01'], // Берем кадр на первой секунде
        filename: thumbnailFileName,
        folder: uploadDir,
      })
      .on('end', () => {
        resolve(thumbnailFileName);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

export async function extractDuration(videoPath: string): Promise<number> {
  const { stdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
  );
  return Math.floor(parseFloat(stdout))
}
