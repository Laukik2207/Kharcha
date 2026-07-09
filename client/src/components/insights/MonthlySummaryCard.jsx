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
        <div className="flex flex-col items-center justify-center py-12 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 text-surface-400 shadow-inner backdrop-blur-md">
            <Sparkles size={28} />
          </div>
          <p className="text-surface-300 font-medium tracking-wide">Add more expenses to generate AI insights</p>
        </div>
      </InsightCard>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreStroke = (score) => {
    if (score >= 70) return '#34d399'; // emerald-400
    if (score >= 40) return '#fbbf24'; // amber-400
    return '#fb7185'; // rose-400
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
          <div className="flex-1 space-y-5">
            <h3 className="text-2xl font-display font-semibold text-white leading-tight tracking-tight">
              {data.headline}
            </h3>
            <p className="text-surface-300 text-base leading-relaxed font-medium">
              {data.summary}
            </p>
            
            <div className="pt-4 border-t border-white/5">
              <ul className="space-y-3">
                {data.highlights?.map((highlight, idx) => (
                  <li key={idx} className="flex items-start text-sm text-surface-200">
                    <span className="text-white opacity-60 mr-3 mt-0.5 shadow-sm">▸</span>
                    <span className="leading-snug">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Health Score */}
          <div className="flex flex-col items-center justify-center md:w-40 shrink-0 bg-[#0A0A0A] p-6 rounded-3xl border border-white/[0.03] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            {/* Subtle glow background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
            
            <div className="relative w-24 h-24 flex items-center justify-center mb-4">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0 drop-shadow-md">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/5"
                />
              </svg>
              {/* Foreground circle with neon stroke */}
              <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" style={{ filter: `drop-shadow(0 0 8px ${getScoreStroke(data.score)}40)` }}>
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke={getScoreStroke(data.score)}
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="226.2" /* 2 * PI * 36 */
                  strokeDashoffset={226.2 * (1 - data.score / 100)}
                  className="transition-all duration-1000 ease-out drop-shadow-lg"
                  strokeLinecap="round"
                />
              </svg>
              {/* Score text */}
              <div className={`absolute flex flex-col items-center justify-center font-display font-semibold text-3xl tracking-tighter ${getScoreColor(data.score)}`}>
                {data.score}
              </div>
            </div>
            <span className={`badge border-none ${getScoreColor(data.score).replace('text-', 'bg-').replace('400', '400/10')} ${getScoreColor(data.score)}`}>
              {data.scoreLabel}
            </span>
          </div>

        </div>
      )}
    </InsightCard>
  );
};

export default MonthlySummaryCard;
