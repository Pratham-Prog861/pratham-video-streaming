import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import videoRoutes from './routes/videoRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Static file serving for videos and thumbnails
app.use('/api/videos/static', express.static(path.join(__dirname, 'videos')));
app.use('/api/thumbnails', express.static(path.join(__dirname, 'thumbnails')));

// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/upload', uploadRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
