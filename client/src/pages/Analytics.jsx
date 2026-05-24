import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import MonthYearSelector from '../components/dashboard/MonthYearSelector';
import StatCard from '../components/common/StatCard';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import CategoryBarChart from '../components/charts/CategoryBarChart';
import MonthlyLineChart from '../components/charts/MonthlyLineChart';
import DailyTrendChart from '../components/charts/DailyTrendChart';
import PaymentMethodChart from '../components/charts/PaymentMethodChart';
import TopMerchantsCard from '../components/dashboard/TopMerchantsCard';
import { formatINR } from '../utils/formatCurrency';
import PageLoader from '../components/common/PageLoader';
import { Wallet, TrendingUp, Tag, CalendarDays } from 'lucide-react';

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

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  const {
    monthlySummary,
    categorySummary,
    yearlySummary,
    dailyTrend,
    topMerchants,
    paymentMethods,
    loading,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear
  } = useAnalytics();

  const tabs = ['Overview', 'Categories', 'Trends'];

  if (loading.yearly && !yearlySummary?.currentMonth) {
    return <PageLoader />;
  }

  return (
    <motion.div 
      className="space-y-6 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="page-header">
        <div>
          <h1 className="page-title">Analytics Hub</h1>
          <p className="page-subtitle">Deep dive into your financial data</p>
        </div>
        <MonthYearSelector 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="border-b border-surface-700/50">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab 
                  ? 'border-primary-500 text-primary-400' 
                  : 'border-transparent text-surface-400 hover:text-white hover:border-surface-700'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'Overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                  title="Total Spent"
                  value={formatINR(yearlySummary?.currentMonth?.total || 0)}
                  subtitle="This month"
                  icon={<Wallet className="w-5 h-5" />}
                  loading={loading.yearly}
                />
                <StatCard
                  title="Transactions"
                  value={yearlySummary?.currentMonth?.transactions || 0}
                  subtitle="This month"
                  icon={<TrendingUp className="w-5 h-5" />}
                  loading={loading.yearly}
                />
                <StatCard
                  title="Top Category"
                  value={categorySummary?.topCategory?.category || 'None'}
                  subtitle={categorySummary?.topCategory ? formatINR(categorySummary.topCategory.totalAmount) : 'No spending'}
                  icon={<Tag className="w-5 h-5" />}
                  loading={loading.categories}
                />
                <StatCard
                  title="Daily Average"
                  value={formatINR(
                    (yearlySummary?.currentMonth?.total || 0) / new Date(selectedYear, selectedMonth, 0).getDate()
                  )}
                  subtitle="This month"
                  icon={<CalendarDays className="w-5 h-5" />}
                  loading={loading.yearly}
                />
              </div>

              <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Yearly Progress</h3>
                  <p className="text-surface-300 text-sm">
                    You have spent <span className="text-primary-400 font-bold text-base font-mono">{formatINR(yearlySummary?.currentYear?.total || 0)}</span> so far in {selectedYear}.
                  </p>
                  <div className="mt-6 flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-xs text-surface-500 uppercase tracking-wider font-semibold mb-1">Last Year Total</span>
                      <span className="font-bold text-white font-mono">{formatINR(yearlySummary?.lastYear?.total || 0)}</span>
                    </div>
                    <div className="w-px h-10 bg-surface-700/50"></div>
                    <div className="flex flex-col">
                      <span className="text-xs text-surface-500 uppercase tracking-wider font-semibold mb-1">YoY Growth</span>
                      <span className={`font-bold ${yearlySummary?.yoyGrowth > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {yearlySummary?.yoyGrowth > 0 ? '+' : ''}{yearlySummary?.yoyGrowth || 0}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 bg-surface-800/50 rounded-2xl p-6 border border-surface-700/50 flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-primary-400 mb-2">{yearlySummary?.currentYear?.transactions || 0}</span>
                    <span className="text-xs text-surface-400 uppercase tracking-wider font-semibold">Total Transactions</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'Categories' && (
            <motion.div 
              key="categories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="section-title">Distribution</h3>
                  <CategoryPieChart data={categorySummary?.byCategory} loading={loading.categories} height={400} />
                </div>
                <div className="glass-card p-6">
                  <h3 className="section-title">Comparison</h3>
                  <CategoryBarChart data={categorySummary?.byCategory} loading={loading.categories} height={400} />
                </div>
              </div>

              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-surface-700/50">
                  <h3 className="section-title mb-0">Category Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-surface-700/50">
                    <thead className="bg-surface-800/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-surface-400 uppercase tracking-wider">Total Amount</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-surface-400 uppercase tracking-wider">Transactions</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-surface-400 uppercase tracking-wider">% of Total</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-surface-400 uppercase tracking-wider">Avg / Transaction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-700/50">
                      {loading.categories ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-surface-500 text-sm animate-pulse">Loading categories...</td>
                        </tr>
                      ) : categorySummary?.byCategory?.length > 0 ? (
                        categorySummary.byCategory.map((cat, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{cat.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-primary-400 font-mono">{formatINR(cat.totalAmount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-surface-300">{cat.count}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-surface-400 font-mono">{cat.percentage}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-surface-400 font-mono">{formatINR(cat.avgAmount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-surface-500 text-sm">No data available for this month</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TRENDS TAB */}
          {activeTab === 'Trends' && (
            <motion.div 
              key="trends"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="section-title">Monthly Spending Trend ({selectedYear})</h3>
                <MonthlyLineChart data={monthlySummary?.monthly} loading={loading.monthly} height={350} />
              </div>

              <div className="glass-card p-6">
                <h3 className="section-title">Daily Spending Pulse ({selectedMonth}/{selectedYear})</h3>
                <DailyTrendChart data={dailyTrend?.dailyTrend} loading={loading.daily} height={250} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="section-title">Payment Methods</h3>
                  <PaymentMethodChart data={paymentMethods?.byPaymentMethod} loading={loading.payments} height={300} />
                </div>
                <div className="h-[400px]">
                  <TopMerchantsCard merchants={topMerchants?.topMerchants} loading={loading.merchants} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Analytics;
