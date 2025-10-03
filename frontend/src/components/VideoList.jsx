import { useVideoList } from '../hooks/useVideoApi';

const VideoList = ({ onVideoSelect, selectedVideo }) => {
  const { videos, loading, error, refetch } = useVideoList();

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-purple-500/30 rounded-lg mr-3"></div>
            <div className="h-6 bg-purple-500/30 rounded-lg flex-1"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 bg-purple-500/30 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-purple-500/30 rounded mb-2"></div>
                  <div className="h-3 bg-purple-500/20 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-red-500/30 p-6">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Connection Error</h3>
          <p className="text-red-200 mb-6 text-sm">{error}</p>
          <button 
            onClick={refetch}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
        <div className="text-center">
          <div className="text-purple-300 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Videos Found</h3>
          <p className="text-purple-200 text-sm leading-relaxed">
            Upload your first video using the form above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">Video Library</h3>
        </div>
        <div className="flex items-center">
          <span className="text-purple-200 text-sm">{videos.length} videos available</span>
          <div className="ml-auto px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-200 rounded-full text-xs font-semibold border border-green-500/30">
            ONLINE
          </div>
        </div>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
        <div className="space-y-3">
          {videos.map((video, index) => (
            <button
              key={video.id || index}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] group ${
                selectedVideo?.id === video.id || selectedVideo === video.filename
                  ? 'border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/25'
                  : 'border-white/10 hover:border-purple-500/30 hover:bg-white/5 bg-white/5'
              }`}
              onClick={() => onVideoSelect(video)}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                  selectedVideo?.id === video.id || selectedVideo === video.filename
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-white/10 text-purple-300 group-hover:bg-gradient-to-r group-hover:from-purple-500/50 group-hover:to-pink-500/50 group-hover:text-white'
                }`}>
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate text-lg transition-colors duration-300 ${
                    selectedVideo?.id === video.id || selectedVideo === video.filename ? 'text-white' : 'text-white group-hover:text-purple-100'
                  }`}>
                    {video.title || video.filename?.replace(/\.[^/.]+$/, "")}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-purple-200 mr-3">
                      {video.filename?.split('.').pop().toUpperCase() || 'MP4'}
                    </span>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 rounded-full text-xs font-medium border border-blue-500/20">
                      HD
                    </span>
                    {video.views > 0 && (
                      <span className="ml-2 text-xs text-purple-300">
                        {video.views} views
                      </span>
                    )}
                  </div>
                </div>
                {(selectedVideo?.id === video.id || selectedVideo === video.filename) && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-200"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-400"></div>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoList;
