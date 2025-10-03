// eslint-disable-next-line no-unused-vars
const Header = ({ onToggleSidebar, sidebarCollapsed }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50 h-14">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white font-semibold text-xl hidden sm:block">StreamVibe</span>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-800 border border-gray-600 rounded-full py-2 px-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-gray-700 rounded-r-full hover:bg-gray-600 transition-colors">
              <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z" />
            </svg>
          </button>
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">U</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
