import React, { useState, useEffect, useCallback } from 'react';

const DEFAULT_MERCHANTS = [
  'Swiggy Food',
  'Amazon Shopping',
  'Uber Ride',
  'Netflix Subscription',
  'Indian Oil Petrol',
  'Apollo Pharmacy',
  'BigBasket Groceries',
  'Airtel Recharge',
  'PVR Cinemas',
  'Zomato Order'
];

const MerchantPreview = ({ pattern, type, onTest }) => {
  const [merchants, setMerchants] = useState(DEFAULT_MERCHANTS);
  const [newMerchant, setNewMerchant] = useState('');
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const runTest = useCallback(async () => {
    if (!pattern || !type) {
      setResults([]);
      return;
    }
    setTesting(true);
    const res = await onTest(pattern, type, merchants);
    if (res?.success) {
      setResults(res.results);
    }
    setTesting(false);
  }, [pattern, type, merchants, onTest]);

  useEffect(() => {
    // Debounce live testing
    const timer = setTimeout(() => {
      runTest();
    }, 500);
    return () => clearTimeout(timer);
  }, [runTest]);

  const handleAddMerchant = (e) => {
    e.preventDefault();
    if (newMerchant.trim() && !merchants.includes(newMerchant.trim())) {
      setMerchants([...merchants, newMerchant.trim()]);
      setNewMerchant('');
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-bold text-gray-300">Live Preview</h4>
        {testing && <span className="text-[10px] text-primary-400 animate-pulse">Testing...</span>}
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto mb-4 pr-1 custom-scrollbar">
        {merchants.map((m, i) => {
          const matchResult = results.find(r => r.merchant === m);
          const isMatch = matchResult?.matches;
          
          return (
            <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded bg-gray-800/30 text-sm">
              <span className="text-gray-300 truncate mr-2">{m}</span>
              {isMatch ? (
                <span className="flex items-center text-green-400 text-xs font-medium">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Match
                </span>
              ) : (
                <span className="text-gray-600 text-xs">—</span>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleAddMerchant} className="flex gap-2">
        <input
          type="text"
          value={newMerchant}
          onChange={(e) => setNewMerchant(e.target.value)}
          placeholder="Add merchant to test..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-primary-500"
        />
        <button
          type="submit"
          disabled={!newMerchant.trim()}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-xs text-white rounded transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default MerchantPreview;
