import Video from '../models/videoModel.js';
import TempVideo from '../models/tempVideoModel.js';
import { getVideoInfo, createVideoThumbnail } from '../utils/ffmpeg.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Step 1: Upload video file and create temp record
export const uploadVideoFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const videoPath = req.file.path;
    const filename = req.file.filename;

    // Get basic video metadata
    let videoMetadata = {
      duration: 0,
      resolution: { width: 0, height: 0 },
      bitrate: 0,
      fps: 0
    };

    try {
      const metadata = await getVideoInfo(videoPath);
      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      
      if (videoStream) {
        videoMetadata = {
          duration: Math.round(parseFloat(metadata.format.duration) || 0),
          resolution: {
            width: videoStream.width || 0,
            height: videoStream.height || 0
          },
          bitrate: parseInt(metadata.format.bit_rate) || 0,
          fps: eval(videoStream.r_frame_rate) || 0
        };
      }
    } catch (metadataError) {
      console.error('Error getting video metadata:', metadataError);
    }

    // Create temporary video record
    const tempVideo = new TempVideo({
      filename: filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimetype: req.file.mimetype,
      filePath: videoPath,
      ...videoMetadata
    });

    const savedTempVideo = await tempVideo.save();

    res.status(201).json({
      message: 'Video file uploaded successfully',
      tempId: savedTempVideo._id,
      filename: filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      duration: videoMetadata.duration
    });

  } catch (error) {
    console.error('File upload error:', error);
    // Clean up file if database save failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      error: 'Failed to upload video file',
      details: error.message 
    });
  }
};

// Step 2: Save video details and finalize processing
export const saveVideoDetails = async (req, res) => {
  try {
    const { tempId } = req.params;
    const { title, description, tags, category, privacy } = req.body;

    // Find temporary video record
    const tempVideo = await TempVideo.findById(tempId);
    if (!tempVideo) {
      return res.status(404).json({ error: 'Temporary video not found' });
    }

    // Generate thumbnail
    let thumbnailFilename = null;
    try {
      const thumbnailName = `thumb-${tempVideo.filename.replace(/\.[^/.]+$/, '')}.jpg`;
      const thumbnailDir = path.join(__dirname, '../thumbnails');
      
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }
      
      const thumbnailPath = path.join(thumbnailDir, thumbnailName);
      await createVideoThumbnail(tempVideo.filePath, thumbnailPath);
      thumbnailFilename = thumbnailName;
      console.log('Thumbnail created successfully:', thumbnailName);
    } catch (thumbnailError) {
      console.error('Error creating thumbnail:', thumbnailError);
    }

    // Create final video record
    const newVideo = new Video({
      filename: tempVideo.filename,
      originalName: tempVideo.originalName,
      title: title || tempVideo.originalName.replace(/\.[^/.]+$/, ''),
      description: description || '',
      tags: tags || [],
      category: category || 'General',
      privacy: privacy || 'public',
      fileSize: tempVideo.fileSize,
      mimetype: tempVideo.mimetype,
      thumbnail: thumbnailFilename,
      duration: tempVideo.duration,
      resolution: tempVideo.resolution,
      bitrate: tempVideo.bitrate,
      fps: tempVideo.fps,
      status: 'ready'
    });

    const savedVideo = await newVideo.save();

    // Delete temporary record
    await TempVideo.findByIdAndDelete(tempId);

    res.status(201).json({
      message: 'Video processed and saved successfully',
      video: {
        id: savedVideo._id,
        title: savedVideo.title,
        description: savedVideo.description,
        filename: savedVideo.filename,
        thumbnail: savedVideo.thumbnail ? `/api/thumbnails/${savedVideo.thumbnail}` : null,
        duration: savedVideo.duration,
        views: savedVideo.views,
        uploadedAt: savedVideo.uploadedAt
      }
    });

  } catch (error) {
    console.error('Video details save error:', error);
    res.status(500).json({ 
      error: 'Failed to save video details',
      details: error.message 
    });
  }
};

// Get temporary video details
export const getVideoDetails = async (req, res) => {
  try {
    const { tempId } = req.params;
    const tempVideo = await TempVideo.findById(tempId);
    
    if (!tempVideo) {
      return res.status(404).json({ error: 'Temporary video not found' });
    }

    res.json({
      id: tempVideo._id,
      filename: tempVideo.filename,
      originalName: tempVideo.originalName,
      fileSize: tempVideo.fileSize,
      duration: tempVideo.duration,
      resolution: tempVideo.resolution
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get video details' });
  }
};

// Delete unprocessed video
export const deleteUnprocessedVideo = async (req, res) => {
  try {
    const { tempId } = req.params;
    const tempVideo = await TempVideo.findById(tempId);
    
    if (!tempVideo) {
      return res.status(404).json({ error: 'Temporary video not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(tempVideo.filePath)) {
      fs.unlinkSync(tempVideo.filePath);
    }

    // Delete temporary record
    await TempVideo.findByIdAndDelete(tempId);

    res.json({ message: 'Temporary video deleted successfully' });
  } catch (error) {
    console.error('Error deleting temporary video:', error);
    res.status(500).json({ error: 'Failed to delete temporary video' });
  }
};
