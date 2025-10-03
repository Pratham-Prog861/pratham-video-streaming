import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  uploadVideoFile, 
  saveVideoDetails, 
  getVideoDetails,
  deleteUnprocessedVideo 
} from '../controllers/uploadController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../videos');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `video-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only video files
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  }
});

// Step 1: Upload video file only
router.post('/file', upload.single('video'), uploadVideoFile);

// Step 2: Save video details and process
router.post('/details/:tempId', saveVideoDetails);

// Get temporary video details
router.get('/temp/:tempId', getVideoDetails);

// Delete unprocessed video
router.delete('/temp/:tempId', deleteUnprocessedVideo);

export default router;
