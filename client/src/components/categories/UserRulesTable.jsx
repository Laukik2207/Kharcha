import React from 'react';
import CategoryBadge from './CategoryBadge';

const UserRulesTable = ({ rules, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse mt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-surface rounded-xl border border-gray-800"></div>
        ))}
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-gray-800 p-8 text-center mt-4">
        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          🤖
        </div>
        <h3 className="text-lg font-bold text-gray-200 mb-1">No custom rules yet</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Add a rule to override automatic categorization. Your rules will be applied to all future uploads and can be used to re-categorize past expenses.
        </p>
      </div>
    );
  }

  const getTypeStyle = (type) => {
    switch(type) {
      case 'keyword': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'regex': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'exact': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {rules.map(rule => (
        <div key={rule._id} className={`bg-surface rounded-xl border ${rule.isActive ? 'border-gray-800 hover:border-gray-700' : 'border-gray-800/50 opacity-60'} p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors`}>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1.5">
              <code className="text-sm font-bold text-gray-200 truncate bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                {rule.pattern}
              </code>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getTypeStyle(rule.type)}`}>
                {rule.type}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
              <CategoryBadge category={rule.category} size="sm" />
              <span className="font-medium" title="Higher priority rules run first">Pri: {rule.priority}</span>
              {rule.description && (
                <span className="truncate max-w-[200px] hidden sm:inline-block border-l border-gray-700 pl-4">{rule.description}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end space-x-4 sm:space-x-6">
            
            <div className="text-center">
              <span className="block text-lg font-bold text-gray-300">{rule.matchCount || 0}</span>
              <span className="text-[10px] uppercase text-gray-500 font-medium">Matches</span>
            </div>

            <div className="flex items-center space-x-2 border-l border-gray-800 pl-4 sm:pl-6">
              {/* Toggle Switch */}
              <button 
                onClick={() => onEdit(rule._id, { isActive: !rule.isActive })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${rule.isActive ? 'bg-primary-500' : 'bg-gray-700'}`}
                title={rule.isActive ? "Deactivate Rule" : "Activate Rule"}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${rule.isActive ? 'translate-x-4' : 'translate-x-1'}`} />
              </button>

              {/* Edit */}
              <button 
                onClick={() => onEdit(rule)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Edit Rule"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              {/* Delete */}
              <button 
                onClick={() => onDelete(rule._id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete Rule"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default UserRulesTable;
