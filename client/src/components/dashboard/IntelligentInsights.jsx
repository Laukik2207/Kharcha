import React from 'react';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const IntelligentInsights = ({ data, loading, onRefresh }) => {
  // If we have real insights, we map them. For now, fallback to static if not enough.
  const insightsList = data?.insights || [
    { type: 'UNUSUAL ACTIVITY', text: 'Your subscription spend is up 22% this week.', color: 'text-white' },
    { type: 'SAVINGS GOAL', text: 'You are on track to reach your savings goal 12 days early.', color: 'text-white' },
    { type: 'TAX ADVISORY', text: '4 business expenses haven\'t been tagged for Q1 yet.', color: 'text-white' }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-white w-5 h-5" />
          <h3 className="font-display text-2xl font-medium text-white">Intelligent Insights</h3>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="text-surface-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-l border-white/10 pl-4 py-1">
                <div className="h-3 bg-white/10 rounded w-24 mb-3"></div>
                <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          insightsList.map((insight, idx) => (
            <div key={idx} className="border-l border-white/20 pl-4 py-1">
              <p className="text-[10px] font-mono text-surface-400 opacity-80 mb-2 tracking-widest">{insight.type || 'INSIGHT'}</p>
              <p className="text-sm text-white font-medium">{insight.text || insight}</p>
            </div>
          ))
        )}
      </div>

      <Link 
        to="/insights"
        className="w-full mt-8 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-surface-50 transition-all flex items-center justify-center gap-2"
      >
        Generate Full Report <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default IntelligentInsights;
