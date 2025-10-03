import axios from 'axios';

const videoAPI = {
    getAllVideos: async () => {
        try {
            const response = await axios.get('/api/videos/');
            return response.data;
        } catch (error) {
            console.error('Error fetching videos:', error);
            throw error;
        }
    },

    getVideoStreamUrl: (video) => {
        const identifier = video.id || video.filename;
        return `/api/videos/${identifier}`;
    },

    checkVideoExists: async (video) => {
        try {
            const identifier = video.id || video.filename;
            const response = await axios.head(`/api/videos/${identifier}`);
            return response.status === 200;
        } catch (error) {
            console.error('Error checking video existence:', error);
            return false;
        }
    },

    deleteVideo: async (videoId) => {
        try {
            const response = await axios.delete(`/api/videos/${videoId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting video:', error);
            throw error;
        }
    },

    // Two-step upload APIs
    uploadVideoFile: async (file, onProgress) => {
        const formData = new FormData();
        formData.append('video', file);

        try {
            const response = await axios.post('/api/upload/file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: onProgress
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },

    saveVideoDetails: async (tempId, details) => {
        try {
            const response = await axios.post(`/api/upload/details/${tempId}`, details);
            return response.data;
        } catch (error) {
            console.error('Error saving video details:', error);
            throw error;
        }
    },

    getTempVideoDetails: async (tempId) => {
        try {
            const response = await axios.get(`/api/upload/temp/${tempId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting temp video details:', error);
            throw error;
        }
    },

    deleteTempVideo: async (tempId) => {
        try {
            const response = await axios.delete(`/api/upload/temp/${tempId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting temp video:', error);
            throw error;
        }
    }
};

export default videoAPI;
