import { useVideoList } from '../hooks/useVideoApi';

// eslint-disable-next-line no-unused-vars
const VideoGrid = ({ onVideoSelect, selectedVideo, layout = 'grid' }) => {
  const { videos, loading, error, refetch } = useVideoList();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-800 rounded-lg aspect-video mb-3"></div>
            <div className="flex space-x-3">
              <div className="w-9 h-9 bg-gray-800 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Error loading videos</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={refetch}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No videos found</h3>
        <p className="text-gray-400">Upload your first video to get started</p>
      </div>
    );
  }

  const gridClasses = layout === 'sidebar' 
    ? 'space-y-4' 
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';

  return (
    <div className={gridClasses}>
      {videos.map((video, index) => (
        <div
          key={video.id || index}
          className={`cursor-pointer group ${layout === 'sidebar' ? 'flex space-x-3' : ''}`}
          onClick={() => onVideoSelect(video)}
        >
          {/* Video Thumbnail */}
          <div className={`bg-gray-800 rounded-lg overflow-hidden relative ${
            layout === 'sidebar' ? 'w-40 h-24 flex-shrink-0' : 'aspect-video'
          }`}>
            {video.thumbnail ? (
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  // Fallback to default thumbnail if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Fallback thumbnail */}
            <div className={`w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center ${
              video.thumbnail ? 'hidden' : 'flex'
            }`}>
              <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Duration overlay */}
            {video.duration && (
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>

          {/* Video Info */}
          <div className={`${layout === 'sidebar' ? 'flex-1' : 'pt-3'}`}>
            <div className={`flex ${layout === 'sidebar' ? 'flex-col' : 'space-x-3'}`}>
              {layout !== 'sidebar' && (
                <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">
                    {(video.title || video.filename)?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 ${
                  layout === 'sidebar' ? 'text-sm' : 'text-base'
                }`}>
                  {video.title || video.filename?.replace(/\.[^/.]+$/, "")}
                </h3>
                <div className={`text-gray-400 ${layout === 'sidebar' ? 'text-xs' : 'text-sm'} mt-1`}>
                  <div>{video.views || 0} views</div>
                  {video.uploadedAt && (
                    <div>{new Date(video.uploadedAt).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
