import React, { useState, useEffect } from 'react';
import { Search, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

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
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 w-full min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-surface-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10 w-full"
            placeholder="Search merchants..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          
          <select 
            value={filters.category || ''} 
            onChange={(e) => setFilter('category', e.target.value)}
            className="input-field min-w-[140px] py-2"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select 
            value={filters.paymentMethod || ''} 
            onChange={(e) => setFilter('paymentMethod', e.target.value)}
            className="input-field min-w-[140px] py-2"
          >
            <option value="">All Methods</option>
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={filters.startDate || ''}
              onChange={(e) => setFilter('startDate', e.target.value)}
              className="input-field min-w-[130px] py-2"
            />
            <span className="text-surface-500 text-sm font-medium">to</span>
            <input 
              type="date" 
              value={filters.endDate || ''}
              onChange={(e) => setFilter('endDate', e.target.value)}
              className="input-field min-w-[130px] py-2"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto xl:ml-0 xl:border-l xl:border-surface-700/50 xl:pl-3">
            <select 
              value={filters.sortBy || 'date'} 
              onChange={(e) => setFilter('sortBy', e.target.value)}
              className="input-field py-2"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="merchant">Merchant</option>
              <option value="category">Category</option>
            </select>
            
            <button
              onClick={() => setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-surface-800/50 border border-surface-700/50 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
              title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {filters.sortOrder === 'asc' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
            </button>
            
            <button
              onClick={resetFilters}
              className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
