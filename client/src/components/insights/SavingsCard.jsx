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
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
              <p className="text-sm text-green-400">
                You could save up to <span className="font-bold text-green-500">{formatINR(data.potentialMonthlySavings)}</span> per month
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
        <p className="text-sm text-gray-400 text-center py-4">No savings data available.</p>
      )}
    </InsightCard>
  );
};

export default SavingsCard;
