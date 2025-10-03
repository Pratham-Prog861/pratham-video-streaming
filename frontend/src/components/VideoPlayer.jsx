import { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ videoName, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoName) return;

    const initializePlayer = () => {
      try {
        setLoading(true);
        setError(null);

        const videoSrc = `/api/videos/${videoName}`;
        
        // Dispose existing player
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }

        // Create video element
        if (videoRef.current) {
          videoRef.current.innerHTML = '';
          const videoElement = document.createElement('video');
          videoElement.className = 'video-js vjs-default-skin w-full rounded-xl';
          videoElement.setAttribute('controls', true);
          videoElement.setAttribute('preload', 'metadata');
          videoElement.setAttribute('width', '100%');
          videoElement.setAttribute('height', '500');
          videoElement.setAttribute('data-setup', '{}');
          
          videoRef.current.appendChild(videoElement);

          const options = {
            controls: true,
            fluid: true,
            responsive: true,
            aspectRatio: '16:9',
            preload: 'metadata',
            sources: [{
              src: videoSrc,
              type: 'video/mp4'
            }],
            playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
            html5: {
              vhs: {
                overrideNative: true
              }
            }
          };

          const player = videojs(videoElement, options);
          playerRef.current = player;

          player.ready(() => {
            console.log('Player is ready');
            setLoading(false);
            onReady?.(player);
          });

          player.on('error', (e) => {
            console.error('Video.js error:', e);
            const error = player.error();
            setError(`Video error: ${error?.message || 'Unable to load video'}`);
            setLoading(false);
          });

          player.on('loadstart', () => setLoading(true));
          player.on('loadedmetadata', () => setLoading(false));
          player.on('canplay', () => setLoading(false));
        }
      } catch (err) {
        console.error('Player initialization error:', err);
        setError(`Failed to load video: ${err.message}`);
        setLoading(false);
      }
    };

    initializePlayer();
  }, [videoName, onReady]);

  useEffect(() => {
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 text-center">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-300 mb-3">Playback Error</h3>
        <p className="text-red-200 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
        >
          Reload Player
        </button>
      </div>
    );
  }

  return (
    <div className="video-player-container relative bg-black rounded-xl overflow-hidden shadow-2xl">
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin mx-auto"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-white text-lg font-medium">Loading video...</p>
            <p className="text-purple-200 text-sm mt-2">Preparing your streaming experience</p>
          </div>
        </div>
      )}
      <div ref={videoRef} className="w-full" />
    </div>
  );
};

export default VideoPlayer;
