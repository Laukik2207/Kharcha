import React from 'react';
import { Link } from 'react-router-dom';
import { formatINR, formatDate } from '../../utils/formatCurrency';
import { CATEGORY_ICONS } from '../../utils/categoryConstants';
import Button from '../common/Button';

const RecentTransactions = ({ expenses, loading }) => {
  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex-1 w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 font-mono text-[11px] text-surface-400 uppercase tracking-widest">
              <th className="py-4 px-6">Transaction</th>
              <th className="py-4 px-6 hidden sm:table-cell">Category</th>
              <th className="py-4 px-6 text-right">Amount</th>
              <th className="py-4 px-6 hidden md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white/5 flex-shrink-0"></div>
                      <div className="space-y-2 w-32">
                        <div className="h-4 bg-white/10 rounded w-full"></div>
                        <div className="h-3 bg-white/10 rounded w-2/3"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden sm:table-cell">
                    <div className="h-4 bg-white/10 rounded w-20"></div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="h-4 bg-white/10 rounded w-16 ml-auto"></div>
                  </td>
                  <td className="py-4 px-6 hidden md:table-cell">
                    <div className="h-5 bg-white/10 rounded w-24"></div>
                  </td>
                </tr>
              ))
            ) : expenses && expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense._id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center flex-shrink-0 text-white opacity-80">
                        <span className="text-xl">{CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Others}</span>
                      </div>
                      <div>
                        <p className="font-body text-white font-medium truncate max-w-[150px] sm:max-w-[200px]">{expense.merchant}</p>
                        <p className="text-[12px] opacity-40">{formatDate(expense.date)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-[12px] opacity-60 hidden sm:table-cell">
                    {expense.category}
                  </td>
                  <td className="py-4 px-6 font-mono text-white text-right font-medium">
                    {formatINR(expense.amount)}
                  </td>
                  <td className="py-4 px-6 hidden md:table-cell">
                    <span className={`text-[10px] font-mono px-2 py-1 rounded ${expense.isUnknownMerchant ? 'bg-amber-900/30 text-amber-400 border border-amber-500/30' : 'bg-white/10 text-white'}`}>
                      {expense.isUnknownMerchant ? 'PENDING' : 'CATEGORIZED'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-12 text-center">
                  <p className="text-surface-500 text-sm mb-4">No recent transactions found</p>
                  <Link to="/expenses">
                    <Button size="sm">Add Expense</Button>
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
