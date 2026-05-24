import React from 'react';

const SparkleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-400">
    <path d="M12 2L13.2929 9.70711L21 11L13.2929 12.2929L12 20L10.7071 12.2929L3 11L10.7071 9.70711L12 2Z" fill="currentColor" />
    <path d="M5 4L5.51724 6.58621L8 7L5.51724 7.41379L5 10L4.48276 7.41379L2 7L4.48276 6.58621L5 4Z" fill="currentColor" />
    <path d="M19 16L19.5172 18.5862L22 19L19.5172 19.4138L19 22L18.4828 19.4138L16 19L18.4828 18.5862L19 16Z" fill="currentColor" />
  </svg>
);

const AIInsightsBanner = () => {
  return (
    <div className="bg-surface border border-gray-800 rounded-2xl p-6 relative overflow-hidden flex items-center justify-between shadow-sm">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <SparkleIcon />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 via-purple-400 to-teal-400 text-transparent bg-clip-text animate-gradient-text">
            Powered by Gemini AI
          </h1>
        </div>
        <p className="text-gray-400 text-sm">
          Personalized financial insights generated from your spending data
        </p>
      </div>
    </div>
  );
};

export default AIInsightsBanner;
