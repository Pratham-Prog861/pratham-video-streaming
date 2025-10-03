import mongoose from 'mongoose';

const tempVideoSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
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
  uploadedAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Auto-delete after 1 hour if not processed
  }
}, {
  timestamps: true
});

export default mongoose.model('TempVideo', tempVideoSchema);
