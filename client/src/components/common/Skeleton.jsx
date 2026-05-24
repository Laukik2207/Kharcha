import React from 'react';

const Skeleton = ({ className = '', ...props }) => {
  return <div className={`skeleton ${className}`} {...props} />;
};

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`glass-card p-6 ${className}`}>
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonTable = ({ rows = 5, className = '' }) => (
  <div className={`w-full ${className}`}>
    <div className="flex gap-4 mb-4 pb-4 border-b border-surface-700">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart = ({ height = '300px', className = '' }) => (
  <Skeleton className={`w-full rounded-2xl ${className}`} style={{ height }} />
);

export default Skeleton;
