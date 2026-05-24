import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-950/90 backdrop-blur-sm">
      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
        <svg className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" stroke="currentColor" strokeWidth="2" 
            className="text-primary-600/30"
          />
          <path 
            d="M 50 5 A 45 45 0 0 1 95 50" 
            fill="none" stroke="currentColor" strokeWidth="3" 
            strokeLinecap="round"
            className="text-primary-500 animate-[pulse_2s_ease-in-out_infinite]"
          />
        </svg>
        <svg className="absolute inset-2 w-20 h-20 animate-[spin_2s_linear_infinite_reverse]" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="35" 
            fill="none" stroke="currentColor" strokeWidth="2" 
            className="text-primary-400/20"
          />
          <path 
            d="M 50 15 A 35 35 0 0 0 15 50" 
            fill="none" stroke="currentColor" strokeWidth="3" 
            strokeLinecap="round"
            className="text-primary-400"
          />
        </svg>
        <div className="w-10 h-10 bg-primary-500/20 rounded-full animate-pulse-slow"></div>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tight gradient-text animate-pulse-slow">
          Kharcha
        </h1>
        <p className="mt-2 text-sm text-surface-400">Loading your finances...</p>
      </div>
    </div>
  );
};

export default Loader;
