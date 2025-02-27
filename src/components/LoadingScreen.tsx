import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-white">Loading...</h2>
        <p className="mt-2 text-gray-400">Please wait while we set things up</p>
      </div>
    </div>
  );
};

export default LoadingScreen;