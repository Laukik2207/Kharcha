import React from 'react';
import InsightCard from './InsightCard';
import PatternItem from './PatternItem';

const PatternCard = ({ data, loading, error, onRefresh, cached, generatedAt }) => {
  return (
    <InsightCard 
      title="Spending Patterns" 
      icon="📊" 
      loading={loading} 
      error={error} 
      onRefresh={onRefresh}
      cached={cached}
      generatedAt={generatedAt}
      accentColor="border-purple-500"
    >
      {data && !data.empty && (
        <div className="space-y-5">
          
          <div className="bg-purple-500/10 border-l-[3px] border-purple-500 p-5 rounded-r-2xl shadow-[0_0_15px_rgba(168,85,247,0.05)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.02] to-transparent pointer-events-none"></div>
            <h3 className="font-medium text-purple-400 italic text-sm mb-2 tracking-wide">
              "{data.topHabit}"
            </h3>
            <p className="text-sm text-surface-300 leading-relaxed font-medium">
              {data.behaviorSummary}
            </p>
          </div>

          <div className="space-y-3">
            {data.patterns?.map((pattern, idx) => (
              <PatternItem key={idx} pattern={pattern} />
            ))}
          </div>

        </div>
      )}
      {data?.empty && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-surface-400 text-center bg-white/5 px-4 py-2 rounded-full border border-white/5">Not enough data to find patterns.</p>
        </div>
      )}
    </InsightCard>
  );
};

export default PatternCard;
