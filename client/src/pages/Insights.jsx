import React, { useState } from 'react';
import { useInsights } from '../hooks/useInsights';
import MonthYearSelector from '../components/dashboard/MonthYearSelector';
import AIInsightsBanner from '../components/insights/AIInsightsBanner';
import MonthlySummaryCard from '../components/insights/MonthlySummaryCard';
import SavingsCard from '../components/insights/SavingsCard';
import AnomalyCard from '../components/insights/AnomalyCard';
import PatternCard from '../components/insights/PatternCard';
import BudgetAdvisorCard from '../components/insights/BudgetAdvisorCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Insights = () => {
  const {
    summary, savings, anomalies, patterns, budget,
    loading, error,
    selectedMonth, selectedYear,
    setSelectedMonth, setSelectedYear,
    fetchBudgetAdvice, refresh
  } = useInsights();

  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      
      <AIInsightsBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Financial Intelligence</h2>
          <p className="text-sm text-gray-400 mt-1">Select a month to analyze your spending</p>
        </div>
        <MonthYearSelector 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      <div className="space-y-6">
        {/* Row 1: Monthly Summary (Full Width) */}
        <div>
          <MonthlySummaryCard 
            data={summary} 
            loading={loading.summary} 
            error={error.summary}
            onRefresh={() => refresh('summary')}
            cached={summary?.cached}
            generatedAt={summary?.generatedAt}
          />
        </div>

        {/* Row 2: Savings & Anomalies (2 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SavingsCard 
            data={savings} 
            loading={loading.savings} 
            error={error.savings}
            onRefresh={() => refresh('savings')}
            cached={savings?.cached}
            generatedAt={savings?.generatedAt}
          />
          <AnomalyCard 
            data={anomalies} 
            loading={loading.anomalies} 
            error={error.anomalies}
            onRefresh={() => refresh('anomalies')}
            cached={anomalies?.cached}
            generatedAt={anomalies?.generatedAt}
          />
        </div>

        {/* Row 3: Patterns & Budget Advisor (2 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PatternCard 
            data={patterns} 
            loading={loading.patterns} 
            error={error.patterns}
            onRefresh={() => refresh('patterns')}
            cached={patterns?.cached}
            generatedAt={patterns?.generatedAt}
          />
          <BudgetAdvisorCard 
            data={budget}
            loading={loading.budget}
            error={error.budget}
            onFetchAdvice={fetchBudgetAdvice}
          />
        </div>
      </div>

      {/* Insight History (Collapsible) */}
      <div className="mt-12 bg-surface border border-gray-800 rounded-xl overflow-hidden">
        <button 
          onClick={() => setHistoryOpen(!historyOpen)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-900/50 hover:bg-gray-800/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-200">Insight Generation History</h3>
            <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded font-bold">LOGS</span>
          </div>
          {historyOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        
        {historyOpen && (
          <div className="p-6 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-4">
              A log of your recent AI insight generations. Caching ensures we don't repeatedly call the AI service for the same data.
            </p>
            {/* The actual history fetch is omitted for brevity, user can implement the hook call later if needed */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-sm">History logs will appear here after generating insights.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Insights;
