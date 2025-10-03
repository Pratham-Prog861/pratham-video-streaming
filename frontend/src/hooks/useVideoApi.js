import { useState, useEffect } from 'react';
import videoAPI from '../utils/api';

export const useVideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await videoAPI.getAllVideos();
      setVideos(data.videos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const refetch = () => {
    setError(null);
    fetchVideos();
  };

  return { videos, loading, error, refetch };
};
