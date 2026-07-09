import React from 'react';
import { formatINR } from '../../utils/formatCurrency';

const SavingsRecommendationItem = ({ recommendation }) => {
  const { title, description, estimatedSaving, category, difficulty, impact } = recommendation;

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
  };

  const impactColors = {
    Low: 'bg-surface-500/10 text-surface-400 border-surface-500/20',
    Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
    High: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
  };

  // Map category to a simple emoji
  const catEmojiMap = {
    'Food': '🍔', 'Shopping': '🛍️', 'Groceries': '🛒', 'Petrol': '⛽', 
    'Entertainment': '🎬', 'Bills': '📱', 'Travel': '✈️', 'Health': '⚕️', 'Others': '📦'
  };
  const icon = catEmojiMap[category] || '💡';

  return (
    <div className="bg-[#050505] border border-white/5 rounded-xl p-4 hover:border-white/10 hover:bg-[#0a0a0a] transition-all duration-300 relative overflow-hidden group shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-3">
          <span className="text-xl mt-0.5 bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center border border-white/5">{icon}</span>
          <div>
            <h4 className="font-semibold text-surface-200 text-sm group-hover:text-white transition-colors tracking-wide">{title}</h4>
            <p className="text-xs text-surface-400 mt-1 leading-relaxed max-w-[90%] font-medium">{description}</p>
          </div>
        </div>
        <div className="text-right shrink-0 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
          <span className="text-sm font-semibold text-emerald-400">{formatINR(estimatedSaving)}</span>
          <span className="text-[10px] text-emerald-400/60 ml-1">/mo</span>
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
