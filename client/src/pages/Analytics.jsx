import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import MonthYearSelector from '../components/dashboard/MonthYearSelector';
import StatCard from '../components/dashboard/StatCard';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import CategoryBarChart from '../components/charts/CategoryBarChart';
import MonthlyLineChart from '../components/charts/MonthlyLineChart';
import DailyTrendChart from '../components/charts/DailyTrendChart';
import PaymentMethodChart from '../components/charts/PaymentMethodChart';
import TopMerchantsCard from '../components/dashboard/TopMerchantsCard';
import { formatINR } from '../utils/formatCurrency';

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

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Analytics Hub</h1>
          <p className="text-gray-400 mt-1 text-sm">Deep dive into your financial data</p>
        </div>
        <MonthYearSelector 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab 
                  ? 'border-primary-500 text-primary-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Spent"
                value={formatINR(yearlySummary?.currentMonth?.total || 0)}
                subtitle="This month"
                loading={loading.yearly}
                color="primary"
              />
              <StatCard
                title="Transactions"
                value={yearlySummary?.currentMonth?.transactions || 0}
                subtitle="This month"
                loading={loading.yearly}
                color="blue"
              />
              <StatCard
                title="Top Category"
                value={categorySummary?.topCategory?.category || 'None'}
                subtitle={categorySummary?.topCategory ? formatINR(categorySummary.topCategory.totalAmount) : 'No spending'}
                loading={loading.categories}
                color="orange"
              />
              <StatCard
                title="Daily Average"
                value={formatINR(
                  (yearlySummary?.currentMonth?.total || 0) / new Date(selectedYear, selectedMonth, 0).getDate()
                )}
                subtitle="This month"
                loading={loading.yearly}
                color="purple"
              />
            </div>

            <div className="bg-surface rounded-xl border border-gray-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-100 mb-2">Yearly Progress</h3>
                <p className="text-gray-400 text-sm">
                  You have spent <span className="text-gray-200 font-bold">{formatINR(yearlySummary?.currentYear?.total || 0)}</span> so far in {selectedYear}.
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Last Year Total</span>
                    <span className="font-medium text-gray-300">{formatINR(yearlySummary?.lastYear?.total || 0)}</span>
                  </div>
                  <div className="w-px h-8 bg-gray-800"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">YoY Growth</span>
                    <span className={`font-medium ${yearlySummary?.yoyGrowth > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {yearlySummary?.yoyGrowth > 0 ? '+' : ''}{yearlySummary?.yoyGrowth || 0}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 bg-gray-900/50 rounded-lg p-4 border border-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-primary-500 mb-1">{yearlySummary?.currentYear?.transactions || 0}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Total Transactions</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'Categories' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Distribution</h3>
                <CategoryPieChart data={categorySummary?.byCategory} loading={loading.categories} height={400} />
              </div>
              <div className="bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Comparison</h3>
                <CategoryBarChart data={categorySummary?.byCategory} loading={loading.categories} height={400} />
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-800">
                <h3 className="text-lg font-bold text-gray-100">Category Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Total Amount</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Transactions</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">% of Total</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Avg / Transaction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {loading.categories ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm animate-pulse">Loading categories...</td>
                      </tr>
                    ) : categorySummary?.byCategory?.length > 0 ? (
                      categorySummary.byCategory.map((cat, idx) => (
                        <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{cat.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-primary-400">{formatINR(cat.totalAmount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-300">{cat.count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-400">{cat.percentage}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-400">{formatINR(cat.avgAmount)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">No data available for this month</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TRENDS TAB */}
        {activeTab === 'Trends' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Monthly Spending Trend ({selectedYear})</h3>
              <MonthlyLineChart data={monthlySummary?.monthly} loading={loading.monthly} height={350} />
            </div>

            <div className="bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Daily Spending Pulse ({selectedMonth}/{selectedYear})</h3>
              <DailyTrendChart data={dailyTrend?.dailyTrend} loading={loading.daily} height={250} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Payment Methods</h3>
                <PaymentMethodChart data={paymentMethods?.byPaymentMethod} loading={loading.payments} height={300} />
              </div>
              <div className="h-[370px]">
                <TopMerchantsCard merchants={topMerchants?.topMerchants} loading={loading.merchants} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analytics;
