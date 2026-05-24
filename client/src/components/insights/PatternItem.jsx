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
    <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 relative overflow-hidden flex gap-3 hover:bg-gray-900/80 transition-colors">
      <div className="text-xl shrink-0 mt-0.5">{icon}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className="font-bold text-gray-200 text-sm">{title}</h4>
          {actionable && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium border bg-green-500/10 text-green-500 border-green-500/20 shrink-0">
              Actionable
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default PatternItem;
