import React from 'react';

const InsightSkeleton = () => {
  return (
    <div className="space-y-4 py-2 w-full">
      <div className="h-4 bg-gray-800/80 rounded animate-pulse w-full"></div>
      <div className="h-4 bg-gray-800/80 rounded animate-pulse w-[85%]"></div>
      <div className="h-4 bg-gray-800/80 rounded animate-pulse w-[70%]"></div>
    </div>
  );
};

export default InsightSkeleton;
