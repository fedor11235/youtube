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
