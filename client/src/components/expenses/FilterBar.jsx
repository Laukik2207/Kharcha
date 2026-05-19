import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Food', 'Shopping', 'Groceries', 'Petrol', 'Entertainment', 'Bills', 'Travel', 'Health', 'Others'];
const METHODS = ['UPI', 'Card', 'Cash', 'Net Banking', 'Other'];

const FilterBar = ({ filters, setFilter, resetFilters }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter('search', searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, setFilter]);

  // Sync if filter resets externally
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  return (
    <div className="bg-surface rounded-xl p-4 border border-gray-800 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 w-full min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 text-gray-200 placeholder-gray-500"
            placeholder="Search merchants..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          
          <select 
            value={filters.category || ''} 
            onChange={(e) => setFilter('category', e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 py-2 px-3 focus:ring-primary-500 focus:border-primary-500 min-w-[140px]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select 
            value={filters.paymentMethod || ''} 
            onChange={(e) => setFilter('paymentMethod', e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 py-2 px-3 focus:ring-primary-500 focus:border-primary-500 min-w-[140px]"
          >
            <option value="">All Methods</option>
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={filters.startDate || ''}
              onChange={(e) => setFilter('startDate', e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 py-2 px-3 focus:ring-primary-500 focus:border-primary-500 min-w-[130px]"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input 
              type="date" 
              value={filters.endDate || ''}
              onChange={(e) => setFilter('endDate', e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 py-2 px-3 focus:ring-primary-500 focus:border-primary-500 min-w-[130px]"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto md:ml-0 border-l border-gray-800 pl-3">
            <select 
              value={filters.sortBy || 'date'} 
              onChange={(e) => setFilter('sortBy', e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="merchant">Merchant</option>
              <option value="category">Category</option>
            </select>
            
            <button
              onClick={() => setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
              title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {filters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
            
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors ml-1"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
