import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { useExpenses } from '../hooks/useExpenses';
import { useInsights } from '../hooks/useInsights';
import MultiDateFilter from '../components/dashboard/MultiDateFilter';
import MonthlyLineChart from '../components/charts/MonthlyLineChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import IntelligentInsights from '../components/dashboard/IntelligentInsights';
import { formatINR } from '../utils/formatCurrency';
import { Link } from 'react-router-dom';
import { getUnknownCount } from '../services/unknownMerchantService';
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
  
  const {
    monthlySummary,
    categorySummary,
    yearlySummary,
    loading: analyticsLoading,
    selectedMonths,
    selectedYears,
    setSelectedMonths,
    setSelectedYears,
    availableDates
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
      className="max-w-container-max mx-auto pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Action Required Alert */}
      {unknownCount > 0 && (
        <motion.div variants={itemVariants} className="mb-stack-lg">
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <span className="material-symbols-outlined text-[20px]">warning</span>
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
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg mb-stack-lg">
        {/* Total Spend */}
        <div className="premium-card p-stack-lg rounded-xl relative overflow-hidden group">
          <p className="font-label-mono text-[12px] text-secondary opacity-60 mb-2">TOTAL SPEND</p>
          <h2 className="font-display-lg text-display-lg text-[32px] font-bold mb-4">
            {analyticsLoading.yearly ? '...' : formatINR(yearlySummary?.currentMonth?.total || 0)}
          </h2>
          
          {yearlySummary?.momGrowth !== undefined && (
            <div className={`flex items-center gap-2 text-body-sm w-fit px-2 py-0.5 rounded ${yearlySummary.momGrowth >= 0 ? 'text-on-error bg-error/10' : 'text-green-400 bg-green-900/30'}`}>
              <span className="material-symbols-outlined text-sm">{yearlySummary.momGrowth >= 0 ? 'trending_up' : 'trending_down'}</span>
              <span>{Math.abs(yearlySummary.momGrowth).toFixed(1)}% vs last month</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20 pointer-events-none chart-mask">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0 20 Q 25 5, 50 15 T 100 10" fill="none" stroke="white" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* AI Savings Tip */}
        <div className="glass-panel p-stack-lg rounded-xl relative border-primary/20 bg-gradient-to-br from-white/5 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <p className="font-label-mono text-[12px] text-primary">AI RECOMMENDATION</p>
          </div>
          <p className="font-body-lg text-primary leading-tight font-medium">
            {getAiRecommendation()}
          </p>
          <Link to="/insights" className="mt-4 text-body-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Burn Rate */}
        <div className="premium-card p-stack-lg rounded-xl">
          <p className="font-label-mono text-[12px] text-secondary opacity-60 mb-2">BURN RATE</p>
          <h2 className="font-display-lg text-display-lg text-[32px] font-bold mb-4">
            {analyticsLoading.yearly ? '...' : formatINR(burnRate)}
            <span className="text-body-lg opacity-40">/day</span>
          </h2>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white opacity-40 transition-all duration-1000" 
              style={{ width: `${budgetExhausted}%` }}
            ></div>
          </div>
          <p className="text-body-sm opacity-40 mt-2">{budgetExhausted}% of monthly budget exhausted</p>
        </div>
      </motion.div>

      {/* Middle Row: Spending Intelligence & Category Breakdown */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-stack-lg mb-stack-lg">
        <div className="xl:col-span-2 premium-card p-stack-lg rounded-xl flex flex-col min-h-[400px]">
          <div className="flex justify-between items-start lg:items-center mb-stack-lg flex-col lg:flex-row gap-4">
            <h3 className="font-headline-md text-headline-md">Spending Intelligence</h3>
            <MultiDateFilter 
              availableDates={availableDates}
              selectedYears={selectedYears}
              selectedMonths={selectedMonths}
              onChange={(years, months) => {
                setSelectedYears(years);
                setSelectedMonths(months);
              }}
            />
          </div>
          <div className="flex-1 w-full relative h-64">
            <MonthlyLineChart 
              data={monthlySummary?.monthly} 
              loading={analyticsLoading.monthly} 
              height={320} 
            />
          </div>
        </div>
        
        <div className="premium-card p-stack-lg rounded-xl flex flex-col min-h-[400px]">
          <h3 className="font-headline-md text-headline-md mb-stack-lg">Categories</h3>
          <div className="flex-1 w-full relative flex items-center justify-center">
            <CategoryPieChart 
              data={categorySummary?.byCategory} 
              loading={analyticsLoading.categories} 
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Transactions & Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-stack-lg">
        <div className="xl:col-span-2 premium-card rounded-xl overflow-hidden flex flex-col">
          <div className="p-stack-lg flex justify-between items-center border-b border-white/5">
            <h3 className="font-headline-md text-headline-md">Recent Transactions</h3>
            <Link to="/expenses" className="text-primary text-body-sm opacity-60 hover:opacity-100 transition-opacity">
              View All
            </Link>
          </div>
          <div className="w-full overflow-x-auto flex-1">
            <RecentTransactions 
              expenses={expenses.slice(0, 5)} 
              loading={expensesLoading} 
            />
          </div>
        </div>
        
        <div className="glass-panel p-stack-lg rounded-xl h-fit">
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
