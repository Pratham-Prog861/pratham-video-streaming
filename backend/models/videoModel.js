import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  originalName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    default: 'General'
  },
  privacy: {
    type: String,
    enum: ['public', 'unlisted', 'private'],
    default: 'public'
  },
  duration: {
    type: Number,
    default: 0
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    default: 'video/mp4'
  },
  resolution: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
  },
  bitrate: {
    type: Number,
    default: 0
  },
  fps: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    default: null
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'error'],
    default: 'ready'
  }
}, {
  timestamps: true
});

// Index for faster queries
videoSchema.index({ uploadedAt: -1 });
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Video', videoSchema);
