import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0A0A0A] border border-white/10 p-3 rounded-lg shadow-2xl backdrop-blur-md relative z-50">
        <p className="font-mono text-xs text-surface-400 mb-1 uppercase tracking-widest">{data.category}</p>
        <p className="text-lg font-display font-bold text-white">{formatINR(data.totalAmount)}</p>
        <p className="text-[10px] text-surface-500 font-mono mt-1">{data.percentage}% OF TOTAL</p>
      </div>
    );
  }
  return null;
};

// Grayscale palette for the pie chart
const GRAYSCALE_COLORS = [
  '#ffffff', // 100% white
  '#d4d4d4', // light gray
  '#a3a3a3', // mid gray
  '#737373', // dark gray
  '#525252', // darker
  '#404040', 
  '#262626'
];

const CategoryPieChart = ({ data, loading }) => {
  if (loading) {
    return <div className="skeleton rounded-xl h-full w-full min-h-[300px]"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-surface-500 text-sm font-mono tracking-widest h-full w-full min-h-[300px]">
        NO SPENDING DATA
      </div>
    );
  }

  const topCategory = data.reduce((max, item) => (item.totalAmount > max.totalAmount ? item : max), data[0]);

  return (
    <div className="h-full w-full min-h-[300px] flex flex-col">
      <div className="flex-1 relative flex items-center justify-center py-4 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalAmount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={GRAYSCALE_COLORS[index % GRAYSCALE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} isAnimationActive={false} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label (Top Category) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-display font-bold text-white">{topCategory.percentage}%</span>
          <span className="text-[10px] font-mono text-surface-500 uppercase tracking-widest mt-1">{topCategory.category}</span>
        </div>
      </div>

      {/* Legend / Breakdown List */}
      <div className="space-y-3 mt-4 max-h-[120px] overflow-y-auto custom-scrollbar px-2">
        {data.slice(0, 4).map((item, index) => (
          <div key={item.category} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: GRAYSCALE_COLORS[index % GRAYSCALE_COLORS.length] }}
              ></div>
              <span className="text-sm font-body text-white opacity-80 truncate max-w-[120px]">{item.category}</span>
            </div>
            <span className="font-mono text-sm text-white">{formatINR(item.totalAmount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPieChart;
