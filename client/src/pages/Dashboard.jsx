import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { useExpenses } from '../hooks/useExpenses';
import { useInsights } from '../hooks/useInsights';
import MultiDateFilter from '../components/dashboard/MultiDateFilter';
import MonthlyLineChart from '../components/charts/MonthlyLineChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import InsightsDrawer from '../components/dashboard/InsightsDrawer';
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
    topMerchants,
    paymentMethods,
    dailyTrend,
    loading: analyticsLoading,
    selectedMonths,
    selectedYears,
    setSelectedMonths,
    setSelectedYears,
    availableDates
  } = useAnalytics();

  const { expenses, fetchExpenses, loading: expensesLoading } = useExpenses();
  const { summary: aiSummary, loading: aiLoading, error: aiError, refreshAll: refreshAi } = useInsights({ types: ['summary'] });
  
  const [unknownCount, setUnknownCount] = useState(0);
  const [isInsightsDrawerOpen, setIsInsightsDrawerOpen] = useState(false);

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

  const isMoreThan3Months = 
    selectedYears.length > 1 || 
    selectedMonths.length === 0 || 
    selectedMonths.length > 3;

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

      {/* Top Banner (Hero) */}
      <motion.div variants={itemVariants} className="mb-stack-lg relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <p className="font-label-mono text-[12px] text-primary font-semibold tracking-wider">AI FINANCIAL SUMMARY</p>
          </div>
          <h2 className="font-display-sm text-2xl font-bold text-white max-w-2xl">
            {aiLoading.summary ? "Analyzing your spending patterns..." : (aiError.summary ? "Unable to generate insights at the moment." : (aiSummary?.headline || "Your financial health is looking good this month."))}
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0">
          {aiSummary?.score && (
            <div className="text-center bg-surface-container-high rounded-xl px-4 py-2 border border-white/5">
              <div className="text-3xl font-black text-primary">{aiSummary.score}</div>
              <div className="text-[10px] text-primary/70 uppercase tracking-widest mt-1">{aiSummary.scoreLabel || 'Score'}</div>
            </div>
          )}
          <Button onClick={() => setIsInsightsDrawerOpen(true)} className="whitespace-nowrap shadow-lg shadow-primary/20">
            View Insights ✨
          </Button>
        </div>
      </motion.div>

      {/* 4 Metric Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-lg mb-stack-lg">
        {/* Spend */}
        <div className="premium-card p-6 rounded-xl relative overflow-hidden group">
          <p className="font-label-mono text-[12px] text-secondary opacity-60 mb-2">TOTAL SPEND</p>
          <h2 className="text-2xl font-bold mb-3">{analyticsLoading.yearly ? '...' : formatINR(yearlySummary?.currentMonth?.total || 0)}</h2>
          {yearlySummary?.momGrowth !== undefined && (
            <div className={`flex items-center gap-1 text-xs w-fit px-2 py-0.5 rounded ${yearlySummary.momGrowth >= 0 ? 'text-on-error bg-error/10' : 'text-green-400 bg-green-900/30'}`}>
              <span className="material-symbols-outlined text-[14px]">{yearlySummary.momGrowth >= 0 ? 'trending_up' : 'trending_down'}</span>
              <span>{Math.abs(yearlySummary.momGrowth).toFixed(1)}% vs last month</span>
            </div>
          )}
        </div>

        {/* Burn Rate */}
        <div className="premium-card p-6 rounded-xl">
          <p className="font-label-mono text-[12px] text-secondary opacity-60 mb-2">BURN RATE</p>
          <h2 className="text-2xl font-bold mb-3">{analyticsLoading.yearly ? '...' : formatINR(burnRate)}<span className="text-sm opacity-40 font-normal">/day</span></h2>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary/80 transition-all duration-1000" style={{ width: `${budgetExhausted}%` }}></div>
          </div>
        </div>

        {/* Top Merchant */}
        <div className="premium-card p-6 rounded-xl">
          <p className="font-label-mono text-[12px] text-secondary opacity-60 mb-2">TOP MERCHANT</p>
          <h2 className="text-xl font-bold truncate mb-1">
            {analyticsLoading.merchants ? '...' : (topMerchants?.topMerchants?.[0]?.merchant || 'N/A')}
          </h2>
          <p className="text-sm text-secondary opacity-60">
            {topMerchants?.topMerchants?.[0]?.totalAmount ? formatINR(topMerchants.topMerchants[0].totalAmount) : '₹0'}
          </p>
        </div>

        {/* Top Payment */}
        <div className="premium-card p-6 rounded-xl">
          <p className="font-label-mono text-[12px] text-secondary opacity-60 mb-2">TOP PAYMENT</p>
          <h2 className="text-xl font-bold truncate mb-1">
            {analyticsLoading.payments ? '...' : (paymentMethods?.byPaymentMethod?.[0]?.paymentMethod || 'N/A')}
          </h2>
          <p className="text-sm text-secondary opacity-60">
            {paymentMethods?.byPaymentMethod?.[0]?.count ? `${paymentMethods.byPaymentMethod[0].count} transactions` : '0 transactions'}
          </p>
        </div>
      </motion.div>

      {/* Spending Intelligence Chart (Full Width) */}
      <motion.div variants={itemVariants} className="premium-card p-stack-lg rounded-xl flex flex-col min-h-[400px] mb-stack-lg">
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
        <div className="flex-1 w-full relative h-64 lg:h-80">
          <MonthlyLineChart 
            dailyData={dailyTrend?.dailyTrend}
            isWeekly={isMoreThan3Months}
            loading={analyticsLoading.monthly || analyticsLoading.daily} 
            height={360} 
          />
        </div>
      </motion.div>
      
      {/* 50/50 Split: Categories and Transactions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg">
        {/* Categories */}
        <div className="premium-card p-stack-lg rounded-xl flex flex-col min-h-[400px]">
          <h3 className="font-headline-md text-headline-md mb-stack-lg">Categories</h3>
          <div className="flex-1 w-full relative flex items-center justify-center">
            <CategoryPieChart 
              data={categorySummary?.byCategory} 
              loading={analyticsLoading.categories} 
            />
          </div>
        </div>

        {/* Transactions */}
        <div className="premium-card rounded-xl overflow-hidden flex flex-col min-h-[400px]">
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
      </motion.div>

      {/* Insights Drawer */}
      <InsightsDrawer 
        isOpen={isInsightsDrawerOpen} 
        onClose={() => setIsInsightsDrawerOpen(false)} 
        data={aiSummary} 
        loading={aiLoading.summary} 
        onRefresh={() => refreshAi()}
      />

    </motion.div>
  );
};

export default Dashboard;
