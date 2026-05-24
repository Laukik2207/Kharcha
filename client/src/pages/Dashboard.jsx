import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { useExpenses } from '../hooks/useExpenses';
import { useAuth } from '../context/AuthContext';
import { useInsights } from '../hooks/useInsights';
import MonthYearSelector from '../components/dashboard/MonthYearSelector';
import StatCard from '../components/common/StatCard';
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
import { AlertTriangle, Sparkles, ArrowRight, Wallet, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import MonthlySummaryCard from '../components/insights/MonthlySummaryCard';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const Dashboard = () => {
  const { user } = useAuth();
  
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

  const { expenses, fetchExpenses, loading: expensesLoading } = useExpenses();
  const { summary: aiSummary, loading: aiLoading, error: aiError, refresh: refreshAi } = useInsights({ types: ['summary'] });
  const [unknownCount, setUnknownCount] = React.useState(0);

  useEffect(() => {
    fetchExpenses();
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

  const isCompletelyEmpty = yearlySummary?.currentYear?.transactions === 0 && yearlySummary?.lastYear?.total === 0 && !analyticsLoading.yearly;

  if (isCompletelyEmpty) {
    return (
      <EmptyState
        icon="🚀"
        title={<>Welcome to <span className="font-bold text-white tracking-tight">Kha<span className="text-white">₹</span>cha</span>!</>}
        subtitle="No data yet. Add your first expense to see your analytics dashboard come to life."
        action={
          <Link to="/expenses">
            <Button>Add First Expense</Button>
          </Link>
        }
      />
    );
  }

  return (
    <motion.div 
      className="space-y-6 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Area */}
      <motion.div variants={itemVariants} className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </p>
        </div>
        <MonthYearSelector 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </motion.div>

      {/* Action Required Alert */}
      {unknownCount > 0 && (
        <motion.div variants={itemVariants}>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glass">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-amber-400 font-semibold text-sm">Action Required</h3>
                <p className="text-amber-400/80 text-xs mt-0.5">
                  You have {unknownCount} transactions with unknown merchants.
                </p>
              </div>
            </div>
            <Link to="/unknown-merchants">
              <Button variant="secondary" size="sm" className="w-full sm:w-auto border-amber-500/30 hover:bg-amber-500/20 text-amber-400">
                Review & Categorize →
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Row 1: Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Spent (This Month)"
          value={formatINR(yearlySummary?.currentMonth?.total || 0)}
          subtitle="vs last month"
          icon={<Wallet className="w-5 h-5" />}
          trend={Math.abs(yearlySummary?.momGrowth || 0)}
          loading={analyticsLoading.yearly}
        />
        <StatCard
          title="Total Transactions"
          value={yearlySummary?.currentMonth?.transactions || 0}
          subtitle="This month"
          icon={<ArrowUpRight className="w-5 h-5" />}
          loading={analyticsLoading.yearly}
        />
        <StatCard
          title="Yearly Total"
          value={formatINR(yearlySummary?.currentYear?.total || 0)}
          subtitle="vs last year"
          icon={<ArrowDownRight className="w-5 h-5" />}
          trend={Math.abs(yearlySummary?.yoyGrowth || 0)}
          loading={analyticsLoading.yearly}
        />
        <StatCard
          title="Top Category"
          value={categorySummary?.topCategory?.category || 'None'}
          subtitle={categorySummary?.topCategory ? formatINR(categorySummary.topCategory.totalAmount) : 'No spending'}
          icon={<Tag className="w-5 h-5" />}
          loading={analyticsLoading.categories}
        />
      </motion.div>

      {/* Row 1.5: AI Quick Insights */}
      <motion.div variants={itemVariants}>
        <div className="glass-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-500 group-hover:bg-primary-500/20"></div>
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700/50 relative z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <h3 className="text-sm font-bold text-white">AI Quick Insight</h3>
            </div>
            <Link to="/insights" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium transition-colors">
              Full Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-2 relative z-10">
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
      </motion.div>

      {/* Row 2: Monthly Trend & Category Donut */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 glass-card p-6">
          <h3 className="section-title">Spending Trend ({selectedYear})</h3>
          <MonthlyLineChart 
            data={monthlySummary?.monthly} 
            loading={analyticsLoading.monthly} 
            height={300} 
          />
        </div>
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="section-title">Spending by Category</h3>
          <CategoryPieChart 
            data={categorySummary?.byCategory} 
            loading={analyticsLoading.categories} 
            height={300} 
          />
        </div>
      </motion.div>

      {/* Row 3: Category Breakdown & Payment Methods */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="section-title">Category Breakdown</h3>
          <CategoryBarChart 
            data={categorySummary?.byCategory} 
            loading={analyticsLoading.categories} 
            height={300} 
          />
        </div>
        <div className="glass-card p-6">
          <h3 className="section-title">Payment Methods</h3>
          <PaymentMethodChart 
            data={paymentMethods?.byPaymentMethod} 
            loading={analyticsLoading.payments} 
            height={300} 
          />
        </div>
      </motion.div>

      {/* Row 4: Recent Transactions & Top Merchants */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 glass-card p-6 min-h-[400px] flex flex-col">
          <h3 className="section-title mb-0">Recent Transactions</h3>
          <div className="flex-1 mt-4">
            <RecentTransactions 
              expenses={expenses.slice(0, 5)} 
              loading={expensesLoading} 
            />
          </div>
        </div>
        <div className="lg:col-span-2 glass-card p-6 min-h-[400px] flex flex-col">
          <h3 className="section-title mb-0">Top Merchants</h3>
          <div className="flex-1 mt-4">
            <TopMerchantsCard 
              merchants={topMerchants?.topMerchants} 
              loading={analyticsLoading.merchants} 
            />
          </div>
        </div>
      </motion.div>

      {/* Row 5: Daily Trend Area Chart */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <h3 className="section-title">Daily Spending This Month</h3>
        <DailyTrendChart 
          data={dailyTrend?.dailyTrend} 
          loading={analyticsLoading.daily} 
          height={250} 
        />
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;
