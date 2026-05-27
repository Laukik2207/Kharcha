import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0A0A0A] border border-white/10 p-3 rounded-lg shadow-2xl backdrop-blur-md relative z-50">
        <p className="font-mono text-xs text-surface-400 mb-1 uppercase tracking-widest">{label}</p>
        <p className="text-lg font-display font-bold text-white">{formatINR(data.totalAmount)}</p>
        <p className="text-[10px] text-surface-500 font-mono mt-1">{data.count} TRANSACTIONS</p>
      </div>
    );
  }
  return null;
};

const MonthlyLineChart = ({ data, loading, height = 300 }) => {
  if (loading) {
    return <div className="skeleton rounded-xl" style={{ height }}></div>;
  }

  const hasData = data && data.some(d => d.totalAmount > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center text-surface-500 text-sm font-mono tracking-widest" style={{ height }}>
        NO SPENDING DATA
      </div>
    );
  }

  return (
    <div style={{ height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity={0.2} />
              <stop offset="100%" stopColor="white" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="0" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => val.toUpperCase()}
            fontFamily="Geist, monospace"
            dy={10}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => value >= 1000 ? `₹${value / 1000}k` : `₹${value}`}
            fontFamily="Geist, monospace"
            dx={-10}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }} 
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="totalAmount" 
            stroke="#ffffff" 
            strokeWidth={3} 
            fill="url(#chartGradient)"
            activeDot={{ r: 6, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 }}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyLineChart;
