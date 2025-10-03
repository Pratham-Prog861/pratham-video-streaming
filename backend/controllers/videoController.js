import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Video from '../models/videoModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllVideos = async (req, res) => {
  try {
    // Get videos from MongoDB instead of filesystem
    const videos = await Video.find({ status: 'ready' })
      .sort({ uploadedAt: -1 })
      .select('filename originalName title description duration fileSize views uploadedAt thumbnail');

    res.json({ 
      videos: videos.map(video => ({
        id: video._id,
        filename: video.filename,
        title: video.title,
        description: video.description,
        duration: video.duration,
        fileSize: video.fileSize,
        views: video.views,
        uploadedAt: video.uploadedAt,
        thumbnail: video.thumbnail ? `/api/thumbnails/${video.thumbnail}` : null
      }))
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos from database' });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found in database' });
    }

    // Increment view count
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({
      ...video.toObject(),
      thumbnail: video.thumbnail ? `/api/thumbnails/${video.thumbnail}` : null
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
};

export const streamVideo = async (req, res) => {
  try {
    const { videoName } = req.params;
    
    // Check if videoName is MongoDB ID or filename
    let video;
    if (videoName.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId
      video = await Video.findById(videoName);
    } else {
      // It's a filename
      video = await Video.findOne({ filename: videoName });
    }

    if (!video) {
      return res.status(404).send('Video not found in database');
    }

    const videoPath = path.join(__dirname, '../videos', video.filename);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).send('Video file not found on disk');
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      res.status(400).send('Requires Range header');
      return;
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;

    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': video.mimetype || 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).send('Error streaming video');
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Delete file from filesystem
    const videoPath = path.join(__dirname, '../videos', video.filename);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // Delete thumbnail if exists
    if (video.thumbnail) {
      const thumbnailPath = path.join(__dirname, '../thumbnails', video.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Delete from database
    await Video.findByIdAndDelete(id);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};
