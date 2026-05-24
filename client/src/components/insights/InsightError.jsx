import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const InsightError = ({ message, onRetry }) => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center py-8">
      <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-3">
        <AlertTriangle className="text-amber-500 w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-amber-500 mb-1">Could not generate insight</h3>
      <p className="text-xs text-gray-400 max-w-xs mb-4">
        {message || 'An error occurred while connecting to the AI service.'}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg transition-colors border border-gray-700"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default InsightError;
