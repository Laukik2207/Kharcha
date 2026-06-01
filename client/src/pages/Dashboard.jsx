import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { useExpenses } from '../hooks/useExpenses';
import { useAuth } from '../context/AuthContext';
import { useInsights } from '../hooks/useInsights';
import MonthYearSelector from '../components/dashboard/MonthYearSelector';
import MonthlyLineChart from '../components/charts/MonthlyLineChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import IntelligentInsights from '../components/dashboard/IntelligentInsights';
import { formatINR } from '../utils/formatCurrency';
import { Link } from 'react-router-dom';
import { getUnknownCount } from '../services/unknownMerchantService';
import { AlertTriangle, TrendingUp, TrendingDown, Sparkles, ArrowRight } from 'lucide-react';
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

  // Calculations for Burn Rate
  const burnRate = useMemo(() => {
    if (!yearlySummary?.currentMonth?.total) return 0;
    const currentDay = new Date().getDate();
    return yearlySummary.currentMonth.total / currentDay;
  }, [yearlySummary]);

  const budgetExhausted = useMemo(() => {
    const total = yearlySummary?.currentMonth?.total || 0;
    const budget = 50000; // Mock budget for UI purposes
    return Math.min(Math.round((total / budget) * 100), 100);
  }, [yearlySummary]);

  // AI Recommendation text extraction
  const getAiRecommendation = () => {
    if (aiLoading.summary) return "Analyzing your recent spending patterns...";
    if (aiError.summary) return "Unable to generate insights at the moment.";
    if (aiSummary?.recommendations?.length > 0) {
      return aiSummary.recommendations[0];
    }
    return "Switching to annual billing for Cloud services could save you ₹4,200/yr.";
  };

  if (isCompletelyEmpty) {
    return (
      <EmptyState
        icon="🚀"
        title={<>Welcome to <span className="font-display font-bold text-white tracking-tight">KHA<span className="text-white">₹</span>CHA</span>!</>}
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
      className="max-w-[1440px] mx-auto pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Area */}
      <motion.div variants={itemVariants} className="page-header mb-8">
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
        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
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

      {/* Top Row: Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Spend */}
        <div className="card relative overflow-hidden group">
          <p className="font-mono text-xs text-surface-400 mb-2 uppercase tracking-widest">TOTAL SPEND</p>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            {analyticsLoading.yearly ? '...' : formatINR(yearlySummary?.currentMonth?.total || 0)}
          </h2>
          
          {yearlySummary?.momGrowth !== undefined && (
            <div className={`flex items-center gap-2 text-sm w-fit px-2 py-0.5 rounded font-mono ${yearlySummary.momGrowth >= 0 ? 'text-red-400 bg-red-900/30' : 'text-green-400 bg-green-900/30'}`}>
              {yearlySummary.momGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(yearlySummary.momGrowth).toFixed(1)}% vs last month</span>
            </div>
          )}

          {/* Sparkline Placeholder */}
          <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0 20 Q 25 5, 50 15 T 100 10" fill="none" stroke="white" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* AI Savings Tip */}
        <div className="glass-card relative border-white/20 bg-gradient-to-br from-white/5 to-transparent p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-white w-4 h-4" />
              <p className="font-mono text-xs text-white uppercase tracking-widest">AI RECOMMENDATION</p>
            </div>
            <p className="font-body text-base text-white leading-tight font-medium line-clamp-3">
              {getAiRecommendation()}
            </p>
          </div>
          <Link to="/insights" className="mt-4 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all text-white w-fit">
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Burn Rate */}
        <div className="card">
          <p className="font-mono text-xs text-surface-400 mb-2 uppercase tracking-widest">BURN RATE</p>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            {analyticsLoading.yearly ? '...' : formatINR(burnRate)}
            <span className="text-lg opacity-40 font-body font-normal">/day</span>
          </h2>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white opacity-40 transition-all duration-1000" 
              style={{ width: `${budgetExhausted}%` }}
            ></div>
          </div>
          <p className="text-sm opacity-40 mt-3 font-mono">{budgetExhausted}% of monthly budget exhausted</p>
        </div>
      </motion.div>

      {/* Middle Row: Spending Intelligence & Category Breakdown */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 card p-0 flex flex-col overflow-hidden min-h-[400px]">
          <div className="flex justify-between items-center p-6 pb-2">
            <h3 className="font-display text-2xl font-medium text-white">Spending Intelligence</h3>
          </div>
          <div className="flex-1 w-full relative">
            <MonthlyLineChart 
              data={monthlySummary?.monthly} 
              loading={analyticsLoading.monthly} 
              height={320} 
            />
          </div>
        </div>
        <div className="card flex flex-col min-h-[400px]">
          <h3 className="font-display text-2xl font-medium text-white mb-6">Categories</h3>
          <div className="flex-1 w-full relative">
            <CategoryPieChart 
              data={categorySummary?.byCategory} 
              loading={analyticsLoading.categories} 
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Transactions & Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-0 overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-white/5">
            <h3 className="font-display text-2xl font-medium text-white">Recent Transactions</h3>
            <Link to="/expenses" className="text-white text-sm opacity-60 hover:opacity-100 transition-opacity">
              View All
            </Link>
          </div>
          <div className="w-full overflow-x-auto">
            <RecentTransactions 
              expenses={expenses.slice(0, 5)} 
              loading={expensesLoading} 
            />
          </div>
        </div>
        <div className="glass-card p-6 h-fit">
          <IntelligentInsights 
            data={aiSummary} 
            loading={aiLoading.summary} 
            onRefresh={() => refreshAi('summary')} 
          />
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;

