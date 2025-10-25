
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-2 h-2 rounded-full animate-pulse bg-indigo-500"></div>
      <div className="w-2 h-2 rounded-full animate-pulse bg-indigo-500" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 rounded-full animate-pulse bg-indigo-500" style={{ animationDelay: '0.4s' }}></div>
      <span className="text-sm text-slate-500 ml-2">wird generiert...</span>
    </div>
  );
};

export default Loader;
