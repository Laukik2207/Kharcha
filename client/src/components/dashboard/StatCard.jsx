import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, loading, color = 'primary' }) => {
  // Map standard tailwind colors to their hex/rgb values or use generic tailwind classes
  const colorMap = {
    primary: 'text-primary-500 bg-primary-500/10 border-primary-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-surface rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors shadow-sm h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 bg-gray-800 animate-pulse rounded w-24"></div>
          ) : (
            <h3 className="text-2xl font-bold text-gray-100">{value}</h3>
          )}
        </div>
        
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${selectedColor}`}>
            {typeof Icon === 'string' ? (
              <span dangerouslySetInnerHTML={{ __html: Icon }} className="w-5 h-5 flex items-center justify-center" />
            ) : (
              <Icon className="w-5 h-5" />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        {loading ? (
          <div className="h-4 bg-gray-800 animate-pulse rounded w-20"></div>
        ) : (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
        
        {!loading && trend && (
          <div className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
            trend.direction === 'up' ? 'text-green-400 bg-green-400/10' :
            trend.direction === 'down' ? 'text-red-400 bg-red-400/10' :
            'text-gray-400 bg-gray-400/10'
          }`}>
            {trend.direction === 'up' && <span className="mr-1">↑</span>}
            {trend.direction === 'down' && <span className="mr-1">↓</span>}
            {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
