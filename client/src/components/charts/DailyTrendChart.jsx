import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
        <p className="font-medium text-gray-200 mb-1">Day {label}</p>
        <p className="text-sm font-bold text-primary-400">{formatINR(data.totalAmount)}</p>
        <p className="text-xs text-gray-400">{data.count} transactions</p>
      </div>
    );
  }
  return null;
};

const DailyTrendChart = ({ data, loading, height = 200 }) => {
  if (loading) {
    return <div className="animate-pulse bg-gray-800/50 rounded-xl" style={{ height }}></div>;
  }

  const hasData = data && data.some(d => d.totalAmount > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
        No spending data for this month
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => (val % 5 === 0 || val === 1) ? val : ''}
          />
          <YAxis hide={true} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#374151', strokeWidth: 1, strokeDasharray: '5 5' }} />
          <Area 
            type="monotone" 
            dataKey="totalAmount" 
            stroke="#0ea5e9" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyTrendChart;
