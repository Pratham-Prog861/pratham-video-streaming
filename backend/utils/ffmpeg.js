import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

export const convertToMp4 = async (inputPath, outputPath) => {
  try {
    const cmd = `ffmpeg -i "${inputPath}" -c:v libx264 -preset fast -crf 22 -c:a aac "${outputPath}"`;
    const { stdout, stderr } = await execAsync(cmd);
    return { success: true, stdout, stderr };
  } catch (error) {
    throw new Error(`FFmpeg conversion failed: ${error.message}`);
  }
};

export const createVideoThumbnail = async (inputPath, outputPath, timeOffset = '00:00:01') => {
  try {
    // Ensure thumbnails directory exists
    const thumbnailDir = path.dirname(outputPath);
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // Create thumbnail with proper scaling and quality
    const cmd = `ffmpeg -i "${inputPath}" -ss ${timeOffset} -vframes 1 -vf "scale=480:270:force_original_aspect_ratio=increase,crop=480:270" -q:v 2 "${outputPath}"`;
    const { stdout, stderr } = await execAsync(cmd);
    console.log('Thumbnail generation completed:', outputPath);
    return { success: true, stdout, stderr };
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    throw new Error(`Thumbnail creation failed: ${error.message}`);
  }
};

export const getVideoInfo = async (videoPath) => {
  try {
    const cmd = `ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`;
    const { stdout } = await execAsync(cmd);
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`Failed to get video info: ${error.message}`);
  }
};
