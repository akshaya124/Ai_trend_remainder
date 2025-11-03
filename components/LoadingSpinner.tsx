import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="text-lg text-gray-600">Summoning AI insights...</p>
    </div>
  );
};

export default LoadingSpinner;