import React, { useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useExpenses } from '../hooks/useExpenses';
import { useAuth } from '../context/AuthContext';
import { useInsights } from '../hooks/useInsights';
import MonthYearSelector from '../components/dashboard/MonthYearSelector';
import StatCard from '../components/dashboard/StatCard';
import MonthlyLineChart from '../components/charts/MonthlyLineChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import CategoryBarChart from '../components/charts/CategoryBarChart';
import PaymentMethodChart from '../components/charts/PaymentMethodChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import TopMerchantsCard from '../components/dashboard/TopMerchantsCard';
import DailyTrendChart from '../components/charts/DailyTrendChart';
import { formatINR } from '../utils/formatCurrency';
import { Link } from 'react-router-dom';
import { getUnknownCount } from '../services/unknownMerchantService';
import { AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import MonthlySummaryCard from '../components/insights/MonthlySummaryCard';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Analytics hook manages all dashboard stats and charts
  const {
    monthlySummary,
    categorySummary,
    yearlySummary,
    dailyTrend,
    topMerchants,
    paymentMethods,
    loading: analyticsLoading,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear
  } = useAnalytics();

  // We need the expenses hook just for the recent transactions list
  const { expenses, fetchExpenses, loading: expensesLoading } = useExpenses();

  // Load AI insight summary for the selected month
  const { summary: aiSummary, loading: aiLoading, error: aiError, refresh: refreshAi } = useInsights();

  const [unknownCount, setUnknownCount] = React.useState(0);

  useEffect(() => {
    // Fetch last 5 expenses
    fetchExpenses();
    
    // Fetch unknown count
    const fetchCount = async () => {
      try {
        const data = await getUnknownCount();
        setUnknownCount(data.count || 0);
      } catch (err) {
        console.error('Failed to fetch unknown count', err);
      }
    };
    fetchCount();
  }, [fetchExpenses]);

  // Check if we have absolutely no data (user has 0 expenses)
  const isCompletelyEmpty = yearlySummary?.currentYear?.transactions === 0 && yearlySummary?.lastYear?.total === 0 && !analyticsLoading.yearly;

  if (isCompletelyEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Welcome to Kharcha!</h2>
        <p className="text-gray-400 max-w-md mb-8">
          No data yet. Add your first expense to see your analytics dashboard come to life.
        </p>
        <Link 
          to="/expenses" 
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          Add First Expense
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </p>
        </div>
        <MonthYearSelector 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Action Required Alert */}
      {unknownCount > 0 && (
        <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl p-4 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-amber-500 w-6 h-6 shrink-0" />
            <div>
              <h3 className="text-amber-500 font-bold text-sm">Action Required</h3>
              <p className="text-amber-400/80 text-xs mt-0.5">
                You have {unknownCount} transactions with unknown merchants.
              </p>
            </div>
          </div>
          <Link 
            to="/unknown-merchants" 
            className="text-xs font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Review & Categorize →
          </Link>
        </div>
      )}

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Spent (This Month)"
          value={formatINR(yearlySummary?.currentMonth?.total || 0)}
          subtitle="vs last month"
          trend={{ 
            value: Math.abs(yearlySummary?.momGrowth || 0), 
            direction: (yearlySummary?.momGrowth || 0) > 0 ? 'up' : (yearlySummary?.momGrowth || 0) < 0 ? 'down' : 'neutral',
            label: 'MoM'
          }}
          loading={analyticsLoading.yearly}
          color="primary"
        />
        <StatCard
          title="Total Transactions"
          value={yearlySummary?.currentMonth?.transactions || 0}
          subtitle="This month"
          loading={analyticsLoading.yearly}
          color="blue"
        />
        <StatCard
          title="Yearly Total"
          value={formatINR(yearlySummary?.currentYear?.total || 0)}
          subtitle="vs last year"
          trend={{ 
            value: Math.abs(yearlySummary?.yoyGrowth || 0), 
            direction: (yearlySummary?.yoyGrowth || 0) > 0 ? 'up' : (yearlySummary?.yoyGrowth || 0) < 0 ? 'down' : 'neutral',
            label: 'YoY'
          }}
          loading={analyticsLoading.yearly}
          color="purple"
        />
        <StatCard
          title="Top Category"
          value={categorySummary?.topCategory?.category || 'None'}
          subtitle={categorySummary?.topCategory ? formatINR(categorySummary.topCategory.totalAmount) : 'No spending'}
          loading={analyticsLoading.categories}
          color="orange"
        />
      </div>

      {/* Row 1.5: AI Quick Insights */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-900/50 border border-gray-800 rounded-xl p-1 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/50 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <h3 className="text-sm font-bold text-gray-200">AI Quick Insight</h3>
          </div>
          <Link to="/insights" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium transition-colors">
            Full Analysis <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-1 relative z-10">
          <MonthlySummaryCard 
            data={aiSummary} 
            loading={aiLoading.summary} 
            error={aiError.summary}
            onRefresh={() => refreshAi('summary')}
            cached={aiSummary?.cached}
            generatedAt={aiSummary?.generatedAt}
          />
        </div>
      </div>

      {/* Row 2: Monthly Trend & Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Spending Trend ({selectedYear})</h3>
          <MonthlyLineChart 
            data={monthlySummary?.monthly} 
            loading={analyticsLoading.monthly} 
            height={300} 
          />
        </div>
        <div className="lg:col-span-2 bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Spending by Category</h3>
          <CategoryPieChart 
            data={categorySummary?.byCategory} 
            loading={analyticsLoading.categories} 
            height={300} 
          />
        </div>
      </div>

      {/* Row 3: Category Breakdown & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Category Breakdown</h3>
          <CategoryBarChart 
            data={categorySummary?.byCategory} 
            loading={analyticsLoading.categories} 
            height={300} 
          />
        </div>
        <div className="bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Payment Methods</h3>
          <PaymentMethodChart 
            data={paymentMethods?.byPaymentMethod} 
            loading={analyticsLoading.payments} 
            height={300} 
          />
        </div>
      </div>

      {/* Row 4: Recent Transactions & Top Merchants */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 h-96">
          <RecentTransactions 
            expenses={expenses.slice(0, 5)} 
            loading={expensesLoading} 
          />
        </div>
        <div className="lg:col-span-2 h-96">
          <TopMerchantsCard 
            merchants={topMerchants?.topMerchants} 
            loading={analyticsLoading.merchants} 
          />
        </div>
      </div>

      {/* Row 5: Daily Trend Area Chart */}
      <div className="bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Daily Spending This Month</h3>
        <DailyTrendChart 
          data={dailyTrend?.dailyTrend} 
          loading={analyticsLoading.daily} 
          height={200} 
        />
      </div>

    </div>
  );
};

export default Dashboard;
