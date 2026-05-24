import React from 'react';
import { SkeletonCard } from './Skeleton';

const PageLoader = () => {
  return (
    <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="w-1/3 h-8 skeleton rounded-lg"></div>
        <div className="w-24 h-10 skeleton rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

export default PageLoader;
