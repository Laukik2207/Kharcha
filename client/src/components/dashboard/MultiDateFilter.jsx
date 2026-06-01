import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MultiDateFilter = ({ availableDates, selectedYears, selectedMonths, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allYears = availableDates.map(d => d.year);
  
  const availableMonthsForSelected = React.useMemo(() => {
    if (selectedYears.length === 0) return [];
    const months = new Set();
    availableDates.forEach(d => {
      if (selectedYears.includes(d.year)) {
        d.months.forEach(m => months.add(m));
      }
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [availableDates, selectedYears]);

  const handleYearToggle = (year) => {
    let newYears;
    if (selectedYears.includes(year)) {
      newYears = selectedYears.filter(y => y !== year);
    } else {
      newYears = [...selectedYears, year];
    }
    // Prevent empty year selection
    if (newYears.length === 0) newYears = [year];
    onChange(newYears, selectedMonths);
  };

  const handleMonthToggle = (month) => {
    let newMonths;
    if (selectedMonths.includes(month)) {
      newMonths = selectedMonths.filter(m => m !== month);
    } else {
      newMonths = [...selectedMonths, month];
    }
    onChange(selectedYears, newMonths);
  };

  const clearMonths = () => onChange(selectedYears, []);

  let yearText = 'Loading...';
  if (allYears.length > 0) {
    yearText = selectedYears.length === allYears.length ? 'All Years' : selectedYears.sort().join(', ');
  }
  let monthText = selectedMonths.length === 0 ? 'All Months' : `${selectedMonths.length} Months`;

  return (
    <div className="relative z-50" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200"
      >
        <Calendar className="w-4 h-4 text-primary-400" />
        <span className="font-medium">{yearText}</span>
        <span className="text-gray-500">•</span>
        <span className="font-medium text-gray-400">{monthText}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="p-4 border-b border-white/5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Years</h3>
              <div className="flex flex-wrap gap-2">
                {allYears.length === 0 ? (
                  <span className="text-sm text-gray-500">No data available</span>
                ) : allYears.map(year => {
                  const isSelected = selectedYears.includes(year);
                  return (
                    <button
                      key={year}
                      onClick={() => handleYearToggle(year)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isSelected ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-black/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Months</h3>
                {selectedMonths.length > 0 && (
                  <button onClick={clearMonths} className="text-xs text-primary-400 hover:text-primary-300">
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {MONTH_NAMES.map((name, idx) => {
                  const monthNum = idx + 1;
                  const isAvailable = availableMonthsForSelected.includes(monthNum);
                  const isSelected = selectedMonths.includes(monthNum);
                  
                  return (
                    <button
                      key={monthNum}
                      disabled={!isAvailable}
                      onClick={() => handleMonthToggle(monthNum)}
                      className={`
                        px-2 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center
                        ${!isAvailable ? 'opacity-20 cursor-not-allowed' : ''}
                        ${isSelected ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}
                      `}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiDateFilter;
