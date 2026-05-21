import React from 'react';
import { formatINR } from '../../utils/formatCurrency';

const TopMerchantsCard = ({ merchants, loading }) => {
  return (
    <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden h-full flex flex-col shadow-sm">
      <div className="p-5 border-b border-gray-800">
        <h2 className="text-lg font-bold text-gray-100">Top Merchants</h2>
      </div>

      <div className="flex-1 p-5 overflow-auto">
        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-800 animate-pulse rounded w-1/3"></div>
                  <div className="h-4 bg-gray-800 animate-pulse rounded w-1/4"></div>
                </div>
                <div className="h-1.5 bg-gray-800 animate-pulse rounded-full w-full"></div>
              </div>
            ))}
          </div>
        ) : merchants && merchants.length > 0 ? (
          <div className="space-y-6">
            {merchants.map((merchant, index) => {
              // Calculate percentage relative to the highest merchant (which is always index 0)
              const maxAmount = merchants[0].totalAmount;
              const percentage = Math.max(5, (merchant.totalAmount / maxAmount) * 100);
              
              return (
                <div key={index}>
                  <div className="flex items-end justify-between mb-1.5">
                    <div className="flex items-center min-w-0 pr-4">
                      <span className="text-xs font-bold text-gray-600 w-4 mr-2">{index + 1}.</span>
                      <p className="text-sm font-medium text-gray-200 truncate">{merchant.merchant}</p>
                      <span className="ml-2 text-[10px] text-gray-500 bg-gray-800/50 px-1.5 py-0.5 rounded">
                        {merchant.count}x
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-300 whitespace-nowrap">
                      {formatINR(merchant.totalAmount)}
                    </p>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-gray-500 text-sm">No merchant data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMerchantsCard;
