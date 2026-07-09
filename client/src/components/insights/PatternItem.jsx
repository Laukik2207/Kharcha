import React from 'react';

const PatternItem = ({ pattern }) => {
  const { title, description, type, actionable } = pattern;

  const typeIcons = {
    timing: '🕐',
    category: '🏷️',
    merchant: '🏪',
    payment: '💳'
  };

  const icon = typeIcons[type] || '📊';

  return (
    <div className="bg-[#050505] border border-white/5 rounded-xl p-4 relative overflow-hidden flex gap-4 hover:border-white/10 hover:bg-[#0a0a0a] transition-all duration-300 shadow-sm group">
      <div className="text-xl shrink-0 mt-0.5 bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center border border-white/5">{icon}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className="font-semibold text-surface-200 text-sm group-hover:text-white transition-colors tracking-wide">{title}</h4>
          {actionable && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              Actionable
            </span>
          )}
        </div>
        <p className="text-xs text-surface-400 mt-1 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
};

export default PatternItem;
