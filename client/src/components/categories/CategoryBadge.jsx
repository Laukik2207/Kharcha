import React from 'react';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/categoryConstants';

const CategoryBadge = ({ category, size = 'sm' }) => {
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.Others;
  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.Others;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs'
  };

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full font-medium border ${colorClass} ${sizeClasses[size]}`}>
      <span>{icon}</span>
      <span>{category || 'Others'}</span>
    </span>
  );
};

export default CategoryBadge;
