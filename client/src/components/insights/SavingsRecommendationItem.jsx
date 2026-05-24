import React from 'react';
import { formatINR } from '../../utils/formatCurrency';

const SavingsRecommendationItem = ({ recommendation }) => {
  const { title, description, estimatedSaving, category, difficulty, impact } = recommendation;

  const difficultyColors = {
    Easy: 'bg-green-500/10 text-green-500 border-green-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Hard: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  const impactColors = {
    Low: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    High: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  // Map category to a simple emoji
  const catEmojiMap = {
    'Food': '🍔', 'Shopping': '🛍️', 'Groceries': '🛒', 'Petrol': '⛽', 
    'Entertainment': '🎬', 'Bills': '📱', 'Travel': '✈️', 'Health': '⚕️', 'Others': '📦'
  };
  const icon = catEmojiMap[category] || '💡';

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 hover:bg-gray-900/80 transition-colors relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-3">
          <span className="text-xl mt-0.5">{icon}</span>
          <div>
            <h4 className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">{title}</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-[85%]">{description}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-sm font-bold text-green-500">{formatINR(estimatedSaving)}</span>
          <span className="text-[10px] text-gray-500 ml-1">/mo</span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-3 ml-8">
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${difficultyColors[difficulty] || difficultyColors.Medium}`}>
          {difficulty}
        </span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${impactColors[impact] || impactColors.Medium}`}>
          {impact} Impact
        </span>
      </div>
    </div>
  );
};

export default SavingsRecommendationItem;
