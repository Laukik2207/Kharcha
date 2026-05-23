import React, { useState, useEffect } from 'react';
import CategoryBadge, { CATEGORY_ICONS } from './CategoryBadge';
import MerchantPreview from './MerchantPreview';

const RuleFormModal = ({ isOpen, onClose, onSubmit, initialData, loading, onTestPreview }) => {
  const [formData, setFormData] = useState({
    type: 'keyword',
    pattern: '',
    category: 'Food',
    description: '',
    priority: 10
  });

  const [regexError, setRegexError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          type: 'keyword',
          pattern: '',
          category: 'Food',
          description: '',
          priority: 10
        });
      }
      setRegexError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validateRegex = (pattern) => {
    if (!pattern) return true;
    try {
      new RegExp(pattern);
      setRegexError('');
      return true;
    } catch (e) {
      setRegexError('Invalid regex pattern');
      return false;
    }
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
    if (type === 'regex') validateRegex(formData.pattern);
    else setRegexError('');
  };

  const handlePatternChange = (e) => {
    const pattern = e.target.value;
    setFormData({ ...formData, pattern });
    if (formData.type === 'regex') {
      validateRegex(pattern);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.type === 'regex' && !validateRegex(formData.pattern)) {
      return;
    }
    if (!formData.pattern.trim()) return;
    onSubmit(formData);
  };

  const getPlaceholder = () => {
    if (formData.type === 'keyword') return 'e.g. swiggy, amazon, netflix';
    if (formData.type === 'exact') return 'e.g. Swiggy Food Delivery';
    return 'e.g. ^(swiggy|zomato)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-xl font-bold text-gray-100">
            {initialData ? 'Edit Custom Rule' : 'Add Custom Rule'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="rule-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grid Layout for Form & Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-5">
                {/* Rule Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rule Type</label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-700 bg-gray-900/50">
                    {['keyword', 'regex', 'exact'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleTypeChange(type)}
                        className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
                          formData.type === type 
                            ? 'bg-primary-500 text-white' 
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pattern */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Match Pattern *</label>
                  <input
                    type="text"
                    required
                    value={formData.pattern}
                    onChange={handlePatternChange}
                    placeholder={getPlaceholder()}
                    className={`w-full px-4 py-2.5 bg-gray-900 border ${regexError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-primary-500 focus:ring-primary-500'} rounded-lg text-gray-200 text-sm transition-colors`}
                  />
                  {regexError ? (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">{regexError}</p>
                  ) : (
                    <p className="mt-1.5 text-[10px] text-gray-500">
                      {formData.type === 'keyword' && 'Matches if merchant contains this text (case insensitive)'}
                      {formData.type === 'exact' && 'Matches only exact merchant names (case insensitive)'}
                      {formData.type === 'regex' && 'Standard JavaScript regular expression (case insensitive)'}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assign to Category *</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200 text-sm appearance-none"
                    >
                      {Object.keys(CATEGORY_ICONS).map(cat => (
                        <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 10 })}
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200 text-sm"
                  />
                  <p className="mt-1.5 text-[10px] text-gray-500">Higher numbers are checked first. Default is 10.</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="E.g. Matches all food delivery apps"
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200 text-sm resize-none custom-scrollbar"
                  />
                </div>

                {/* Preview Tool */}
                <MerchantPreview 
                  pattern={formData.pattern} 
                  type={formData.type} 
                  onTest={onTestPreview} 
                />
              </div>

            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="rule-form"
            disabled={loading || !!regexError || !formData.pattern.trim()}
            className="px-6 py-2.5 text-sm font-bold bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <svg className="w-5 h-5 mr-2 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? 'Saving...' : 'Save Rule'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RuleFormModal;
