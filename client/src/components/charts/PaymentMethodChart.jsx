import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/formatCurrency';

const CHART_COLORS = ['#0ea5e9', '#a855f7', '#22c55e', '#f97316', '#ef4444', '#eab308', '#ec4899', '#14b8a6'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
        <p className="font-medium text-gray-200 mb-1">{data.paymentMethod}</p>
        <p className="text-sm font-bold text-gray-100">{formatINR(data.totalAmount)}</p>
        <p className="text-xs text-gray-400">{data.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

const PaymentMethodChart = ({ data, loading, height = 300 }) => {
  if (loading) {
    return <div className="animate-pulse bg-gray-800/50 rounded-xl" style={{ height }}></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
        No payment data available
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="totalAmount"
            nameKey="paymentMethod"
            cx="50%"
            cy="50%"
            outerRadius={80}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentMethodChart;
