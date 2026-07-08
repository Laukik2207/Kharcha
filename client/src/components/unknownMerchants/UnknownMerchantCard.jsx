import React, { useState } from 'react';
import { formatINR, formatDate } from '../../utils/formatCurrency';
import { HelpCircle, Check, X } from 'lucide-react';

const CATEGORIES = ['Food', 'Shopping', 'Groceries', 'Petrol', 'Entertainment', 'Bills', 'Travel', 'Health', 'Others'];

const UnknownMerchantCard = ({ merchant, onAssign, onDismiss, assigning }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [createRule, setCreateRule] = useState(true);
  const [ruleType, setRuleType] = useState('keyword');

  const handleAssign = () => {
    if (selectedCategory) {
      onAssign(merchant._id, selectedCategory, createRule, ruleType);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-gray-800 p-5 relative overflow-hidden flex flex-col h-full shadow-sm hover:border-gray-700 transition-colors">
      {assigning && (
        <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Header Row */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 shrink-0">
            <HelpCircle size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-100 truncate" title={merchant._id}>
              {merchant._id}
            </h3>
            <div className="flex items-center text-xs text-gray-500 gap-2 mt-0.5">
              <span>{merchant.count} transactions</span>
              <span>•</span>
              <span>Last: {formatDate(merchant.lastSeen)}</span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-bold text-primary-400">{formatINR(merchant.totalAmount)}</p>
        </div>
      </div>

      {/* Payment Methods & Note */}
      <div className="mb-5 flex-1 space-y-3">
        {merchant.paymentMethods && merchant.paymentMethods.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {merchant.paymentMethods.map(pm => (
              <span key={pm} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-800 text-gray-400">
                {pm}
              </span>
            ))}
          </div>
        )}
        {merchant.sampleNote && (
          <div className="bg-gray-800/30 p-2.5 rounded-lg border border-gray-800/50">
            <p className="text-xs text-gray-400 italic truncate" title={merchant.sampleNote}>
              "{merchant.sampleNote.length > 60 ? merchant.sampleNote.substring(0, 60) + '...' : merchant.sampleNote}"
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-4 pt-4 border-t border-gray-800/50">
        <div className="space-y-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
          >
            <option value="">Select category...</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex flex-col gap-2">
            <label className="flex items-center text-sm text-gray-300 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={createRule}
                onChange={(e) => setCreateRule(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-900 border-gray-700 rounded focus:ring-primary-500 focus:ring-2"
              />
              <span className="ml-2 group-hover:text-gray-100 transition-colors">Remember this merchant</span>
            </label>
            
            {createRule && (
              <div className="flex bg-gray-900 rounded-lg p-1 w-full text-xs ml-6" style={{ width: 'calc(100% - 24px)' }}>
                <button
                  onClick={() => setRuleType('keyword')}
                  className={`flex-1 py-1 rounded-md transition-colors ${ruleType === 'keyword' ? 'bg-gray-700 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Keyword Match
                </button>
                <button
                  onClick={() => setRuleType('exact')}
                  className={`flex-1 py-1 rounded-md transition-colors ${ruleType === 'exact' ? 'bg-gray-700 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Exact Match
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleAssign}
            disabled={!selectedCategory || assigning}
            className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-800 disabled:text-gray-500 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {assigning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Check size={16} />
            )}
            Assign
          </button>
          <button
            onClick={() => onDismiss(merchant._id)}
            disabled={assigning}
            className="px-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 text-sm font-medium rounded-lg transition-colors group relative"
            title="Mark as Others and never flag again"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnknownMerchantCard;
