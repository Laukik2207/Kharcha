import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
        <p className="font-medium text-gray-200 mb-1">{label}</p>
        <p className="text-sm font-bold text-primary-400">{formatINR(data.totalAmount)}</p>
        <p className="text-xs text-gray-400">{data.count} transactions</p>
      </div>
    );
  }
  return null;
};

const MonthlyLineChart = ({ data, loading, height = 300 }) => {
  if (loading) {
    return <div className="animate-pulse bg-gray-800/50 rounded-xl" style={{ height }}></div>;
  }

  const hasData = data && data.some(d => d.totalAmount > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
        No spending data for this year
      </div>
    );
  }

  const validMonths = data.filter(d => d.totalAmount > 0);
  const avgAmount = validMonths.length > 0 
    ? validMonths.reduce((sum, d) => sum + d.totalAmount, 0) / validMonths.length 
    : 0;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => value >= 1000 ? `₹${value / 1000}k` : `₹${value}`}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#374151', strokeWidth: 1, strokeDasharray: '5 5' }} />
          {avgAmount > 0 && (
            <ReferenceLine 
              y={avgAmount} 
              stroke="#6b7280" 
              strokeDasharray="3 3" 
              label={{ position: 'insideTopLeft', value: 'Avg', fill: '#9ca3af', fontSize: 10 }} 
            />
          )}
          <Line 
            type="monotone" 
            dataKey="totalAmount" 
            stroke="#0ea5e9" 
            strokeWidth={2.5} 
            dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#bae6fd', stroke: '#0ea5e9', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyLineChart;
