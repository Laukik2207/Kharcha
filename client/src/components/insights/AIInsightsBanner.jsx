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
    <div className="premium-card rounded-3xl p-8 relative overflow-hidden flex items-center justify-between group">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-surface-800 to-transparent pointer-events-none opacity-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-white/[0.05] transition-all duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-inner">
            <SparkleIcon />
          </div>
          <h1 className="text-2xl font-display font-semibold text-white tracking-wide">
            Powered by Gemini AI
          </h1>
        </div>
        <p className="text-surface-400 font-medium tracking-wide">
          Personalized financial insights generated from your spending data
        </p>
      </div>
    </div>
  );
};

export default AIInsightsBanner;
