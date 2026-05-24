import React from 'react';
import { motion } from 'framer-motion';
import { SkeletonCard } from './Skeleton';

const StatCard = ({ title, value, subtitle, icon, trend, loading }) => {
  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <motion.div 
      className="glass-card-hover relative overflow-hidden p-6"
      whileHover={{ y: -3 }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-purple-500 rounded-l-2xl"></div>
      
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-surface-400">{title}</h3>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-surface-800/50 border border-surface-700 flex items-center justify-center text-primary-400">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl font-bold text-white">{value}</h2>
        {trend && (
          <span className={`flex items-center text-xs font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? (
              <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      
      {subtitle && (
        <p className="mt-1 text-xs text-surface-500">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default StatCard;
