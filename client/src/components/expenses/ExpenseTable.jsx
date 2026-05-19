import React from 'react';
import { formatINR, formatDate } from '../../utils/formatCurrency';

const CATEGORY_COLORS = {
  Food: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Shopping: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  Groceries: 'bg-green-500/10 text-green-500 border-green-500/20',
  Petrol: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Entertainment: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  Bills: 'bg-red-500/10 text-red-500 border-red-500/20',
  Travel: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Health: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  Others: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
};

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
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-4 p-4 bg-surface rounded-xl border border-gray-800">
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-800 rounded w-1/4"></div>
              <div className="h-3 bg-gray-800 rounded w-1/6"></div>
            </div>
            <div className="h-6 bg-gray-800 rounded w-20 self-center"></div>
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-12 border border-gray-800 flex flex-col items-center justify-center text-center">
        <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-300">No expenses found</h3>
        <p className="text-gray-500 mt-1 mb-6 max-w-sm">
          We couldn't find any expenses matching your current filters. Try adjusting them or add a new expense.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Merchant</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-200">{expense.merchant}</div>
                  {expense.note && <div className="text-xs text-gray-500 truncate max-w-xs">{expense.note}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Others}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-200">
                  {formatINR(expense.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {expense.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="text-gray-400 hover:text-gray-200 mr-3 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(expense._id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stack */}
      <div className="md:hidden divide-y divide-gray-800">
        {expenses.map((expense) => (
          <div key={expense._id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-medium text-gray-200">{expense.merchant}</div>
                <div className="text-xs text-gray-500 mt-0.5">{formatDate(expense.date)} • {expense.paymentMethod}</div>
              </div>
              <div className="text-sm font-semibold text-gray-200">
                {formatINR(expense.amount)}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Others}`}>
                {expense.category}
              </span>
              <div className="flex space-x-4">
                <button onClick={() => onEdit(expense)} className="text-gray-400 hover:text-gray-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button onClick={() => onDelete(expense._id)} className="text-gray-400 hover:text-red-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
            {expense.note && <div className="text-xs text-gray-400 italic bg-gray-900/50 p-2 rounded">{expense.note}</div>}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="bg-gray-900/30 px-4 py-3 border-t border-gray-800 flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing <span className="font-medium text-gray-200">{expenses.length > 0 ? (currentPage - 1) * 20 + 1 : 0}</span> to <span className="font-medium text-gray-200">{Math.min(currentPage * 20, totalCount)}</span> of <span className="font-medium text-gray-200">{totalCount}</span> expenses
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setFilter('page', currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-surface text-sm font-medium text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-surface text-sm font-medium text-gray-200">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setFilter('page', currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-surface text-sm font-medium text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Mobile pagination controls */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <button
              onClick={() => setFilter('page', currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-surface hover:bg-gray-800 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setFilter('page', currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-surface hover:bg-gray-800 disabled:opacity-50"
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
