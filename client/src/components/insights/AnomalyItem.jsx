import React from 'react';

const AnomalyItem = ({ anomaly }) => {
  const { type, title, description, category, severity } = anomaly;

  const severityColors = {
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  const severityBars = {
    Low: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    Medium: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    High: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
  };

  const typeIcons = {
    overspend: '📈',
    frequency: '🔄',
    new_category: '🆕',
    spike: '⚡'
  };

  const icon = typeIcons[type] || '⚠️';

  return (
    <div className="bg-[#050505] border border-white/5 rounded-xl p-4 relative overflow-hidden flex gap-4 hover:border-white/10 hover:bg-[#0a0a0a] transition-all duration-300 shadow-md group">
      {/* Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${severityBars[severity] || severityBars.Medium}`}></div>
      
      <div className="text-xl shrink-0 mt-0.5 bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center border border-white/5">{icon}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-semibold text-surface-200 text-sm truncate group-hover:text-white transition-colors tracking-wide">{title}</h4>
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border shrink-0 ${severityColors[severity] || severityColors.Medium}`}>
            {severity} Risk
          </span>
        </div>
        <p className="text-xs text-surface-400 mt-1.5 leading-relaxed font-medium">{description}</p>
        <div className="mt-3 text-[10px] text-surface-500 font-medium tracking-wider uppercase flex items-center gap-1.5">
          <span>Category</span>
          <span className="w-1 h-1 rounded-full bg-surface-600"></span>
          <span className="text-surface-300 font-semibold">{category}</span>
        </div>
      </div>
    </div>
  );
};

export default AnomalyItem;
