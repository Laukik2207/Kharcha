import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatINR, formatDate } from '../../utils/formatCurrency';
import CategoryBadge from '../categories/CategoryBadge';
import { SkeletonTable } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import { Edit2, Trash2, SearchX } from 'lucide-react';

const ExpenseTable = ({ 
  expenses, 
  loading, 
  totalCount, 
  totalPages, 
  currentPage, 
  setFilter, 
  onEdit, 
  onDelete 
}) => {
  if (loading) {
    return (
      <div className="glass-card p-6">
        <SkeletonTable rows={5} />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="glass-card">
        <EmptyState
          icon={<SearchX className="w-10 h-10" />}
          title="No expenses found"
          subtitle="We couldn't find any expenses matching your current filters. Try adjusting them or add a new expense."
        />
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-700/50">
          <thead className="bg-surface-800/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">Merchant</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-surface-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700/50">
            <AnimatePresence initial={false}>
              {expenses.map((expense) => (
                <motion.tr 
                  key={expense._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-300">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{expense.merchant}</div>
                    {expense.note && <div className="text-xs text-surface-500 truncate max-w-[200px] mt-0.5">{expense.note}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CategoryBadge category={expense.category} size="md" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-white font-mono">
                    {formatINR(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-400">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-800/50 border border-surface-700/50 text-xs">
                      {expense.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(expense)}
                        className="p-1.5 text-surface-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(expense._id)}
                        className="p-1.5 text-surface-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Stack */}
      <div className="md:hidden divide-y divide-surface-700/50">
        <AnimatePresence initial={false}>
          {expenses.map((expense) => (
            <motion.div 
              key={expense._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 space-y-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">{expense.merchant}</div>
                  <div className="text-xs text-surface-500 mt-0.5">{formatDate(expense.date)} • {expense.paymentMethod}</div>
                </div>
                <div className="text-sm font-bold text-white font-mono shrink-0">
                  {formatINR(expense.amount)}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <CategoryBadge category={expense.category} size="sm" />
                <div className="flex items-center gap-1">
                  <button onClick={() => onEdit(expense)} className="p-2 text-surface-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(expense._id)} className="p-2 text-surface-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {expense.note && <div className="text-xs text-surface-400 italic bg-surface-800/50 p-2 rounded-lg border border-surface-700/50">{expense.note}</div>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="bg-surface-800/30 px-4 py-4 border-t border-surface-700/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-surface-400 text-center sm:text-left">
            Showing <span className="font-medium text-white">{expenses.length > 0 ? (currentPage - 1) * 20 + 1 : 0}</span> to <span className="font-medium text-white">{Math.min(currentPage * 20, totalCount)}</span> of <span className="font-medium text-white">{totalCount}</span> expenses
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setFilter('page', currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-surface-600 bg-surface-800 text-sm font-medium text-surface-200 hover:bg-surface-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                let pageNum = currentPage;
                if (totalPages <= 5) pageNum = idx + 1;
                else if (currentPage <= 3) pageNum = idx + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + idx;
                else pageNum = currentPage - 2 + idx;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilter('page', pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNum 
                        ? 'bg-primary-600 text-white shadow-glow-primary' 
                        : 'text-surface-400 hover:bg-surface-800 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setFilter('page', currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-surface-600 bg-surface-800 text-sm font-medium text-surface-200 hover:bg-surface-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
