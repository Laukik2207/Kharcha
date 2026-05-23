import React from 'react';
import { Link } from 'react-router-dom';
import { formatINR, formatDate } from '../../utils/formatCurrency';
import CategoryBadge, { CATEGORY_ICONS, CATEGORY_COLORS } from '../categories/CategoryBadge';

const RecentTransactions = ({ expenses, loading }) => {
  return (
    <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden h-full flex flex-col shadow-sm">
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-100">Recent Transactions</h2>
        <Link to="/expenses" className="text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors">
          View All →
        </Link>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="divide-y divide-gray-800">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 w-full">
                  <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse flex-shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-800 animate-pulse rounded w-1/3"></div>
                    <div className="h-3 bg-gray-800 animate-pulse rounded w-1/4"></div>
                  </div>
                  <div className="h-5 bg-gray-800 animate-pulse rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : expenses && expenses.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {expenses.map((expense) => (
              <div key={expense._id} className="p-4 hover:bg-gray-800/30 transition-colors flex items-center justify-between group">
                <div className="flex items-center space-x-4 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0 ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Others}`}>
                    <span className="text-lg">{CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Others}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{expense.merchant}</p>
                    <p className="text-xs text-gray-500 truncate">{formatDate(expense.date)} • {expense.paymentMethod}</p>
                    <div className="mt-1">
                      <CategoryBadge category={expense.category} size="sm" />
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-sm font-bold text-primary-400">{formatINR(expense.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <p className="text-gray-500 text-sm mb-4">No recent transactions found</p>
            <Link 
              to="/expenses" 
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Add Expense
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
