import { useState } from 'react';
import axios from 'axios';

const VideoUpload = ({ onUploadSuccess }) => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Details Form, 3: Success
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [tempVideoData, setTempVideoData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: 'General',
    privacy: 'public'
  });

  // Step 1: Handle file upload
  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('video', file);

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await axios.post('/api/upload/file', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setTempVideoData(response.data);
      setFormData({
        ...formData,
        title: response.data.originalName.replace(/\.[^/.]+$/, '')
      });
      setStep(2);
      setUploading(false);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Step 2: Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!tempVideoData) return;

    try {
      setUploading(true);

      const response = await axios.post(`/api/upload/details/${tempVideoData.tempId}`, {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });

      onUploadSuccess?.(response.data.video);
      setStep(3);
      setUploading(false);

      // Reset after 3 seconds
      setTimeout(() => {
        setStep(1);
        setTempVideoData(null);
        setFormData({
          title: '',
          description: '',
          tags: '',
          category: 'General',
          privacy: 'public'
        });
      }, 3000);

    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Failed to save video details: ' + (error.response?.data?.error || error.message));
      setUploading(false);
    }
  };

  const handleCancel = async () => {
    if (tempVideoData) {
      try {
        await axios.delete(`/api/upload/temp/${tempVideoData.tempId}`);
      } catch (error) {
        console.error('Error deleting temp video:', error);
      }
    }
    setStep(1);
    setTempVideoData(null);
    setFormData({
      title: '',
      description: '',
      tags: '',
      category: 'General',
      privacy: 'public'
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (step === 1) {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && step === 1) {
      handleFileUpload(file);
    }
  };

  // Step 1: File Upload
  if (step === 1) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Upload Video</h2>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
            dragOver 
              ? 'border-blue-500 bg-blue-500/5' 
              : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          {uploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium text-lg">Uploading...</p>
                <p className="text-gray-400 text-sm">{uploadProgress}% complete</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 max-w-md mx-auto">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div>
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">Upload video</h3>
              <p className="text-gray-400 mb-6">Drag and drop video files to upload</p>
              <p className="text-gray-500 text-sm mb-6">Your videos will be private until you publish them.</p>
              
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded cursor-pointer transition-colors font-medium inline-block"
              >
                SELECT FILES
              </label>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Video Details Form
  if (step === 2) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Video Details</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {tempVideoData && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-12 bg-gray-700 rounded flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">{tempVideoData.originalName}</p>
                <p className="text-gray-400 text-sm">
                  {(tempVideoData.fileSize / (1024 * 1024)).toFixed(2)} MB
                  {tempVideoData.duration > 0 && ` • ${Math.floor(tempVideoData.duration / 60)}:${(tempVideoData.duration % 60).toString().padStart(2, '0')}`}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-32 resize-none"
              maxLength={1000}
              placeholder="Tell viewers about your video..."
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Separate tags with commas"
            />
            <p className="text-gray-500 text-sm mt-1">Help people find your video with tags that describe your content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="General">General</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Gaming">Gaming</option>
                <option value="Music">Music</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="News">News</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Privacy</label>
              <select
                value={formData.privacy}
                onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.title.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              {uploading ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Step 3: Success
  if (step === 3) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Video Published!</h3>
        <p className="text-gray-400">Your video has been successfully uploaded and is now available.</p>
      </div>
    );
  }

  return null;
};

export default VideoUpload;
