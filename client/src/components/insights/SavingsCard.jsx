import React from 'react';
import InsightCard from './InsightCard';
import SavingsRecommendationItem from './SavingsRecommendationItem';
import { formatINR } from '../../utils/formatCurrency';

const SavingsCard = ({ data, loading, error, onRefresh, cached, generatedAt }) => {
  return (
    <InsightCard 
      title="Savings Opportunities" 
      icon="💰" 
      loading={loading} 
      error={error} 
      onRefresh={onRefresh}
      cached={cached}
      generatedAt={generatedAt}
      accentColor="border-green-500"
    >
      {data && !data.empty && (
        <div className="space-y-4">
          {data.potentialMonthlySavings > 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <p className="text-sm text-emerald-400/90 font-medium tracking-wide">
                You could save up to <span className="font-bold text-emerald-400 text-lg">{formatINR(data.potentialMonthlySavings)}</span> per month
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            {data.recommendations?.map((rec, idx) => (
              <SavingsRecommendationItem key={idx} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
      {data?.empty && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-surface-400 text-center bg-white/5 px-4 py-2 rounded-full border border-white/5">No savings data available.</p>
        </div>
      )}
    </InsightCard>
  );
};

export default SavingsCard;
