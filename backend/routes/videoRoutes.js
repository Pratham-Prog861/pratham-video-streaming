import express from 'express';
import { streamVideo, getAllVideos, getVideoById, deleteVideo } from '../controllers/videoController.js';

const router = express.Router();

// Get all videos from database
router.get('/', getAllVideos);

// Get specific video info by ID
router.get('/info/:id', getVideoById);

// Stream video by filename or ID
router.get('/:videoName', streamVideo);

// Delete video
router.delete('/:id', deleteVideo);

export default router;
