import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import InsightSkeleton from './InsightSkeleton';
import InsightError from './InsightError';

const InsightCard = ({ title, icon, children, loading, error, onRefresh, cached, generatedAt, accentColor }) => {
  
  const getRelativeTime = (dateString) => {
    const generated = new Date(dateString);
    const diffInMinutes = Math.floor((Date.now() - generated.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hrs ago`;
    return '1 day ago';
  };

  return (
    <div className={`bg-surface rounded-2xl border border-gray-800 shadow-sm overflow-hidden flex flex-col h-full animate-fade-slide-up border-l-4 ${accentColor}`}>
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h2 className="text-lg font-bold text-gray-100">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {cached && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-gray-400">
              Cached
            </span>
          )}
          {onRefresh && (
            <button 
              onClick={onRefresh} 
              disabled={loading}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
              title="Refresh insight"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        {loading ? (
          <InsightSkeleton />
        ) : error ? (
          <InsightError message={error} onRetry={onRefresh} />
        ) : (
          children
        )}
      </div>

      {/* Footer / Meta */}
      {!loading && !error && generatedAt && (
        <div className="px-5 py-2.5 bg-gray-900/50 border-t border-gray-800 mt-auto">
          <p className="text-[10px] text-gray-500 font-medium text-right">
            Generated {getRelativeTime(generatedAt)}
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
