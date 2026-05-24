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
          
          <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-purple-400 italic text-sm mb-1">
              "{data.topHabit}"
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
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
        <p className="text-sm text-gray-400 text-center py-4">Not enough data to find patterns.</p>
      )}
    </InsightCard>
  );
};

export default PatternCard;
