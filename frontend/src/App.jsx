import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VideoGrid from './components/VideoGrid';
import VideoUpload from './components/VideoUpload';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const [activeView, setActiveView] = useState('home'); // 'home', 'upload', 'watch'
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [refreshVideos, setRefreshVideos] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setActiveView('watch');
  };

  const handleUploadSuccess = (video) => {
    console.log('Video uploaded successfully:', video);
    setRefreshVideos(prev => prev + 1);
    setActiveView('home');
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Upload Video</h1>
            <VideoUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        );
      case 'watch':
        return selectedVideo ? (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VideoPlayer
                  videoName={selectedVideo.filename || selectedVideo}
                  onReady={(player) => console.log('Player ready:', player)}
                />
                <div className="bg-gray-900 rounded-lg p-4 mt-4">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {selectedVideo.title || selectedVideo.filename?.replace(/\.[^/.]+$/, "")}
                  </h2>
                  <div className="flex items-center space-x-4 text-gray-300 text-sm">
                    <span>{selectedVideo.views || 0} views</span>
                    {selectedVideo.uploadedAt && (
                      <span>{new Date(selectedVideo.uploadedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  {selectedVideo.description && (
                    <p className="text-gray-300 mt-3">{selectedVideo.description}</p>
                  )}
                </div>
              </div>
              <div className="lg:col-span-1">
                <VideoGrid 
                  onVideoSelect={handleVideoSelect}
                  selectedVideo={selectedVideo}
                  layout="sidebar"
                  key={refreshVideos}
                />
              </div>
            </div>
          </div>
        ) : null;
      default:
        return (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Home</h1>
            <VideoGrid 
              onVideoSelect={handleVideoSelect}
              selectedVideo={selectedVideo}
              layout="grid"
              key={refreshVideos}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <Header 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeView={activeView}
          onViewChange={setActiveView}
          collapsed={sidebarCollapsed}
        />

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-200 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}>
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
