import React from 'react';

const AnomalyItem = ({ anomaly }) => {
  const { type, title, description, category, severity } = anomaly;

  const severityColors = {
    Low: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Medium: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    High: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  const severityBars = {
    Low: 'bg-yellow-500',
    Medium: 'bg-orange-500',
    High: 'bg-red-500'
  };

  const typeIcons = {
    overspend: '📈',
    frequency: '🔄',
    new_category: '🆕',
    spike: '⚡'
  };

  const icon = typeIcons[type] || '⚠️';

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 relative overflow-hidden flex gap-3">
      {/* Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${severityBars[severity] || severityBars.Medium}`}></div>
      
      <div className="text-xl shrink-0 mt-0.5">{icon}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-bold text-gray-200 text-sm truncate">{title}</h4>
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border shrink-0 ${severityColors[severity] || severityColors.Medium}`}>
            {severity} Risk
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>
        <div className="mt-2 text-[10px] text-gray-500 font-medium">
          Category: <span className="text-gray-300">{category}</span>
        </div>
      </div>
    </div>
  );
};

export default AnomalyItem;
