import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

const CATEGORIES = ['Food', 'Shopping', 'Groceries', 'Petrol', 'Entertainment', 'Bills', 'Travel', 'Health', 'Others'];

const CLIENT_HINTS = {
  food: 'Food', eat: 'Food', restaurant: 'Food', cafe: 'Food', kitchen: 'Food',
  grocery: 'Groceries', supermarket: 'Groceries', mart: 'Groceries',
  shop: 'Shopping', store: 'Shopping', bazaar: 'Shopping',
  petrol: 'Petrol', fuel: 'Petrol', diesel: 'Petrol', pump: 'Petrol',
  travel: 'Travel', cab: 'Travel', auto: 'Travel', bus: 'Travel', train: 'Travel',
  cinema: 'Entertainment', movie: 'Entertainment', game: 'Entertainment',
  bill: 'Bills', recharge: 'Bills', electric: 'Bills', internet: 'Bills',
  hospital: 'Health', doctor: 'Health', medical: 'Health', pharma: 'Health',
};

const guessCategory = (merchantName) => {
  const lower = merchantName.toLowerCase();
  for (const [hint, category] of Object.entries(CLIENT_HINTS)) {
    if (lower.includes(hint)) return category;
  }
  return '';
};

const BulkAssignModal = ({ isOpen, onClose, merchants, onAssignAll, assigning }) => {
  const [assignments, setAssignments] = useState({});

  // Initialize assignments with smart guesses when modal opens
  useEffect(() => {
    if (isOpen && merchants.length > 0) {
      const initialAssignments = {};
      merchants.forEach(m => {
        initialAssignments[m._id] = {
          category: guessCategory(m._id),
          createRule: true
        };
      });
      setAssignments(initialAssignments);
    }
  }, [isOpen, merchants]);

  if (!isOpen) return null;

  const handleCategoryChange = (merchantId, category) => {
    setAssignments(prev => ({
      ...prev,
      [merchantId]: { ...prev[merchantId], category }
    }));
  };

  const handleRuleChange = (merchantId, createRule) => {
    setAssignments(prev => ({
      ...prev,
      [merchantId]: { ...prev[merchantId], createRule }
    }));
  };

  const handleSave = () => {
    // Filter out rows where no category was selected
    const validAssignments = Object.entries(assignments)
      .filter(([_, data]) => data.category !== '')
      .map(([merchantId, data]) => ({
        merchant: merchantId,
        category: data.category,
        createRule: data.createRule,
        ruleType: 'keyword' // Defaulting to keyword for bulk
      }));

    if (validAssignments.length > 0) {
      onAssignAll(validAssignments);
      onClose();
    }
  };

  const assignedCount = Object.values(assignments).filter(a => a.category !== '').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <div>
            <h2 className="text-xl font-bold text-gray-100">Assign All Unknown Merchants</h2>
            <p className="text-sm text-gray-400 mt-1">Quickly assign categories to all unknown merchants at once.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {merchants.map(merchant => {
              const state = assignments[merchant._id] || { category: '', createRule: true };
              
              return (
                <div key={merchant._id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-900/30 border border-gray-800 p-4 rounded-xl hover:border-gray-700 transition-colors">
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-200 truncate">{merchant._id}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>{merchant.count} txns</span>
                      <span>•</span>
                      <span className="font-medium text-gray-400">{formatINR(merchant.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <select
                      value={state.category}
                      onChange={(e) => handleCategoryChange(merchant._id, e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2 min-w-[140px]"
                    >
                      <option value="">Skip...</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    <label className="flex items-center cursor-pointer group whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={state.createRule}
                        onChange={(e) => handleRuleChange(merchant._id, e.target.checked)}
                        className="w-4 h-4 text-primary-600 bg-gray-900 border-gray-700 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">Remember</span>
                    </label>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-300">
            <span className="text-primary-400 font-bold">{assignedCount}</span> of {merchants.length} assigned
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              disabled={assigning}
              className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={assignedCount === 0 || assigning}
              className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors flex items-center gap-2"
            >
              {assigning ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              Assign Selected
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BulkAssignModal;
