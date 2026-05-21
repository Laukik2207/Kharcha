import React from 'react';

const MonthYearSelector = ({ selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="flex items-center gap-2 bg-gray-900/50 p-1 rounded-lg border border-gray-800">
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(Number(e.target.value))}
        className="bg-transparent text-sm text-gray-200 py-1.5 pl-3 pr-8 focus:ring-0 focus:outline-none border-none cursor-pointer font-medium"
      >
        {months.map(m => (
          <option key={m.value} value={m.value} className="bg-gray-900">
            {m.label}
          </option>
        ))}
      </select>
      
      <div className="w-px h-4 bg-gray-700"></div>
      
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="bg-transparent text-sm text-gray-200 py-1.5 pl-2 pr-8 focus:ring-0 focus:outline-none border-none cursor-pointer font-medium"
      >
        {years.map(y => (
          <option key={y} value={y} className="bg-gray-900">
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthYearSelector;
