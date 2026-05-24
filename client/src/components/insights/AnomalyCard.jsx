import React from 'react';
import InsightCard from './InsightCard';
import AnomalyItem from './AnomalyItem';
import { CheckCircle2 } from 'lucide-react';

const AnomalyCard = ({ data, loading, error, onRefresh, cached, generatedAt }) => {
  const riskColors = {
    Low: 'bg-green-500 text-white',
    Medium: 'bg-amber-500 text-white',
    High: 'bg-red-500 text-white'
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
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 className="text-green-500 w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-green-500 mb-1">Looking Good!</h3>
              <p className="text-xs text-gray-400">No unusual spending detected this month.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${riskColors[data.overallRisk] || riskColors.Medium}`}>
                  {data.overallRisk} Risk
                </span>
                <p className="text-xs text-gray-300 font-medium flex-1">{data.riskReason}</p>
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
        <p className="text-sm text-gray-400 text-center py-4">No data to detect anomalies.</p>
      )}
    </InsightCard>
  );
};

export default AnomalyCard;
