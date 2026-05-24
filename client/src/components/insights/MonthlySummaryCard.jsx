import React, { useEffect, useState } from 'react';
import InsightCard from './InsightCard';
import { Sparkles } from 'lucide-react';

const MonthlySummaryCard = ({ data, loading, error, onRefresh, cached, generatedAt }) => {
  const [scoreOffset, setScoreOffset] = useState(175.9);
  
  useEffect(() => {
    if (data && !loading && !error && !data.empty) {
      const radius = 28;
      const circumference = 2 * Math.PI * radius;
      // Small delay to ensure the element is rendered before starting the animation
      setTimeout(() => {
        setScoreOffset(circumference * (1 - data.score / 100));
      }, 50);
    } else {
      setScoreOffset(175.9); // Reset
    }
  }, [data, loading, error]);

  if (data?.empty) {
    return (
      <InsightCard title="Monthly Summary" icon="🧠" accentColor="border-primary-500">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mb-3 text-gray-500">
            <Sparkles size={24} />
          </div>
          <p className="text-gray-400 text-sm">Add more expenses to generate AI insights</p>
        </div>
      </InsightCard>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreStroke = (score) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <InsightCard 
      title="Monthly Summary" 
      icon="🧠" 
      loading={loading} 
      error={error} 
      onRefresh={onRefresh}
      cached={cached}
      generatedAt={generatedAt}
      accentColor="border-primary-500"
    >
      {data && (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Main content */}
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-semibold text-primary-400 leading-tight">
              {data.headline}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {data.summary}
            </p>
            
            <div className="pt-2 border-t border-gray-800/50">
              <ul className="space-y-2 mt-2">
                {data.highlights?.map((highlight, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-300">
                    <span className="text-primary-500 mr-2 mt-0.5">▸</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Health Score */}
          <div className="flex flex-col items-center justify-center md:w-32 shrink-0 bg-gray-900/30 p-4 rounded-xl border border-gray-800/50">
            <div className="relative w-20 h-20 flex items-center justify-center mb-2">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                <circle
                  cx="40"
                  cy="40"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-gray-800"
                />
              </svg>
              {/* Foreground circle */}
              <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                <circle
                  cx="40"
                  cy="40"
                  r="28"
                  stroke={getScoreStroke(data.score)}
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="175.9"
                  strokeDashoffset={scoreOffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Score text */}
              <div className={`absolute flex flex-col items-center justify-center font-bold text-xl ${getScoreColor(data.score)}`}>
                {data.score}
              </div>
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${getScoreColor(data.score)}`}>
              {data.scoreLabel}
            </span>
          </div>

        </div>
      )}
    </InsightCard>
  );
};

export default MonthlySummaryCard;
