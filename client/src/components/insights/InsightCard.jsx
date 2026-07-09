import React from 'react';
import { RefreshCw } from 'lucide-react';
import InsightSkeleton from './InsightSkeleton';
import InsightError from './InsightError';

const InsightCard = ({ title, icon, children, loading, error, onRefresh, cached, generatedAt, accentColor }) => {
  
  const [relativeTime, setRelativeTime] = React.useState('');

  React.useEffect(() => {
    if (!generatedAt) return;
    
    const updateTime = () => {
      const generated = new Date(generatedAt);
      const diffInMinutes = Math.floor((Date.now() - generated.getTime()) / 60000);
      
      if (diffInMinutes < 1) setRelativeTime('Just now');
      else if (diffInMinutes < 60) setRelativeTime(`${diffInMinutes} mins ago`);
      else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) setRelativeTime(`${diffInHours} hrs ago`);
        else setRelativeTime('1 day ago');
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, [generatedAt]);

  return (
    <div className={`premium-card rounded-3xl overflow-hidden flex flex-col h-full animate-fade-slide-up relative group`}>
      {/* Glow Top Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${accentColor ? accentColor.replace('border-', 'text-') : 'text-white'}`}></div>
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-800/80 border border-white/5 flex items-center justify-center text-xl shadow-inner">
            {icon}
          </div>
          <h2 className="text-lg font-semibold text-white tracking-wide">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {cached && (
            <span className="badge badge-gray">
              Cached
            </span>
          )}
          {onRefresh && (
            <button 
              onClick={onRefresh} 
              disabled={loading}
              className="text-surface-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all duration-300 disabled:opacity-50"
              title="Refresh insight"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col relative z-10">
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
        <div className="px-6 py-3 bg-black/40 border-t border-white/[0.05] mt-auto backdrop-blur-md">
          <p className="text-[10px] text-surface-500 font-mono tracking-wider uppercase text-right">
            Generated {relativeTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
