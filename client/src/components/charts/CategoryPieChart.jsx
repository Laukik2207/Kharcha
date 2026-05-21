import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/formatCurrency';

const CATEGORY_COLORS = {
  Food: '#f97316',
  Shopping: '#a855f7',
  Groceries: '#22c55e',
  Petrol: '#eab308',
  Entertainment: '#ec4899',
  Bills: '#ef4444',
  Travel: '#3b82f6',
  Health: '#14b8a6',
  Others: '#6b7280',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
        <p className="font-medium text-gray-200 mb-1">{data.category}</p>
        <p className="text-sm font-bold text-gray-100">{formatINR(data.totalAmount)}</p>
        <p className="text-xs text-gray-400">{data.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

const CategoryPieChart = ({ data, loading, height = 300 }) => {
  if (loading) {
    return <div className="animate-pulse bg-gray-800/50 rounded-xl" style={{ height }}></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
        No spending data
      </div>
    );
  }

  const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div style={{ height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="totalAmount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.Others} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ marginTop: '-36px' }}>
        <span className="text-lg font-bold text-gray-100">{formatINR(totalAmount)}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total Spent</span>
      </div>
    </div>
  );
};

export default CategoryPieChart;
