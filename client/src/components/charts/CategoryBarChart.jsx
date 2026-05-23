import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/formatCurrency';
import { CATEGORY_COLORS } from '../categories/CategoryBadge';

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

const CategoryBarChart = ({ data, loading, height = 300 }) => {
  if (loading) {
    return <div className="animate-pulse bg-gray-800/50 rounded-xl" style={{ height }}></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
        No category data available
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            stroke="#6b7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => value >= 1000 ? `₹${value / 1000}k` : `₹${value}`}
          />
          <YAxis 
            type="category" 
            dataKey="category" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#374151', opacity: 0.2}} />
          <Bar dataKey="totalAmount" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => {
              const bgClass = CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.Others;
              // Extract a hex color from the tailwind text color class if possible, or fallback to default tailwind colors for chart fill
              let fillColor = '#6b7280';
              if (bgClass.includes('orange')) fillColor = '#f97316';
              else if (bgClass.includes('purple')) fillColor = '#a855f7';
              else if (bgClass.includes('green')) fillColor = '#22c55e';
              else if (bgClass.includes('yellow')) fillColor = '#eab308';
              else if (bgClass.includes('pink')) fillColor = '#ec4899';
              else if (bgClass.includes('red')) fillColor = '#ef4444';
              else if (bgClass.includes('blue')) fillColor = '#3b82f6';
              else if (bgClass.includes('teal')) fillColor = '#14b8a6';

              return <Cell key={`cell-${index}`} fill={fillColor} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBarChart;
