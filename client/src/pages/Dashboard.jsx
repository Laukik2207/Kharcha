import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExpenseSummary, getExpenses } from '../services/expenseService';
import { formatINR, formatDate } from '../utils/formatCurrency';
import { useAuth } from '../context/AuthContext';

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

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1; // 1-12
        const year = currentDate.getFullYear();
        
        // Parallel fetching
        const [summaryRes, expensesRes] = await Promise.all([
          getExpenseSummary({ month, year }),
          getExpenses({ limit: 5, sortBy: 'date', sortOrder: 'desc' })
        ]);

        if (summaryRes.success) setSummary(summaryRes.data);
        if (expensesRes.success) setRecentExpenses(expensesRes.data.expenses);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-surface rounded-xl border border-gray-800 p-6">
              <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="h-64 bg-surface rounded-xl border border-gray-800"></div>
      </div>
    );
  }

  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  
  // Calculate highest category safely
  const highestCategoryObj = summary?.byCategory?.[0] || { category: 'None', totalAmount: 0 };
  
  // Calculate total transactions
  const totalTransactions = summary?.byCategory?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  
  // Calculate daily average
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const currentDay = currentDate.getDate();
  const dailyAverage = summary?.totalSpent ? summary.totalSpent / currentDay : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
        <p className="text-gray-400 mt-1">Here's your expense overview for {currentMonthName} {currentDate.getFullYear()}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors shadow-sm">
          <p className="text-sm font-medium text-gray-400 mb-1">Total Spent</p>
          <h3 className="text-2xl font-bold text-primary-500">{formatINR(summary?.totalSpent || 0)}</h3>
        </div>
        
        <div className="bg-surface rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors shadow-sm">
          <p className="text-sm font-medium text-gray-400 mb-1">Highest Category</p>
          <h3 className="text-xl font-bold text-gray-100 truncate">{highestCategoryObj.category}</h3>
          <p className="text-xs text-gray-500 mt-1">{formatINR(highestCategoryObj.totalAmount)}</p>
        </div>
        
        <div className="bg-surface rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors shadow-sm">
          <p className="text-sm font-medium text-gray-400 mb-1">Transactions</p>
          <h3 className="text-2xl font-bold text-gray-100">{totalTransactions}</h3>
        </div>
        
        <div className="bg-surface rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors shadow-sm">
          <p className="text-sm font-medium text-gray-400 mb-1">Daily Average</p>
          <h3 className="text-2xl font-bold text-gray-100">{formatINR(dailyAverage)}</h3>
        </div>
      </div>

      {/* Recent Expenses List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-100">Recent Expenses</h2>
          <Link to="/expenses" className="text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors">
            View All →
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="bg-surface rounded-xl p-10 border border-gray-800 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300">No expenses yet</h3>
            <p className="text-gray-500 mt-1 mb-6 text-sm">Start tracking your spending by adding an expense.</p>
            <Link 
              to="/expenses" 
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Add your first expense
            </Link>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden divide-y divide-gray-800">
            {recentExpenses.map((expense) => (
              <div key={expense._id} className="p-4 hover:bg-gray-800/30 transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Others}`}>
                    <span className="text-lg font-bold">{expense.category.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{expense.merchant}</p>
                    <p className="text-xs text-gray-500">{formatDate(expense.date)} • {expense.paymentMethod}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-200">{formatINR(expense.amount)}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Others}`}>
                    {expense.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
