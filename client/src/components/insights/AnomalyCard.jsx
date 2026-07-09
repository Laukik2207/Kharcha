import React from 'react';
import InsightCard from './InsightCard';
import AnomalyItem from './AnomalyItem';
import { CheckCircle2 } from 'lucide-react';

const AnomalyCard = ({ data, loading, error, onRefresh, cached, generatedAt }) => {
  const riskColors = {
    Low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    Medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    High: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
  };

  return (
    <InsightCard 
      title="Unusual Spending" 
      icon="⚠️" 
      loading={loading} 
      error={error} 
      onRefresh={onRefresh}
      cached={cached}
      generatedAt={generatedAt}
      accentColor="border-amber-500"
    >
      {data && !data.empty && (
        <div className="space-y-4">
          {!data.hasAnomalies ? (
            <div className="flex flex-col items-center justify-center py-10 text-center relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="text-emerald-400 w-7 h-7" />
              </div>
              <h3 className="text-sm font-semibold text-emerald-400 mb-1 tracking-wide">Looking Good!</h3>
              <p className="text-xs text-surface-400 font-medium">No unusual spending detected this month.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 bg-[#050505] p-4 rounded-xl border border-white/5 shadow-inner">
                <span className={`px-3 py-1 rounded-md text-xs font-semibold ${riskColors[data.overallRisk] || riskColors.Medium}`}>
                  {data.overallRisk} Risk
                </span>
                <p className="text-sm text-surface-300 font-medium flex-1 leading-relaxed">{data.riskReason}</p>
              </div>

              <div className="space-y-3 mt-4">
                {data.anomalies?.map((anomaly, idx) => (
                  <AnomalyItem key={idx} anomaly={anomaly} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {data?.empty && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-surface-400 text-center bg-white/5 px-4 py-2 rounded-full border border-white/5">No data to detect anomalies.</p>
        </div>
      )}
    </InsightCard>
  );
};

export default AnomalyCard;
