import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInsights } from '../hooks/useInsights';
import MonthYearSelector from '../components/dashboard/MonthYearSelector';
import AIInsightsBanner from '../components/insights/AIInsightsBanner';
import MonthlySummaryCard from '../components/insights/MonthlySummaryCard';
import SavingsCard from '../components/insights/SavingsCard';
import AnomalyCard from '../components/insights/AnomalyCard';
import PatternCard from '../components/insights/PatternCard';
import BudgetAdvisorCard from '../components/insights/BudgetAdvisorCard';
import { ChevronDown, RefreshCw } from 'lucide-react';
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

const Insights = () => {
  const {
    summary, savings, anomalies, patterns, budget,
    loading, error,
    selectedMonth, selectedYear,
    setSelectedMonth, setSelectedYear,
    fetchBudgetAdvice, refreshAll
  } = useInsights();

  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <motion.div 
      className="space-y-6 max-w-7xl mx-auto pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <AIInsightsBanner />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-surface-400 tracking-tight mb-2">
            Financial Intelligence
          </h2>
          <p className="text-surface-400 font-medium tracking-wide">Select a month to analyze your spending</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            onClick={refreshAll}
            disabled={loading.summary || loading.savings || loading.anomalies || loading.patterns}
            className="btn-secondary hover:bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading.summary || loading.savings || loading.anomalies || loading.patterns ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline text-white font-medium">Refresh Insights</span>
          </Button>
          <MonthYearSelector 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Row 1: Monthly Summary (Full Width) */}
        <motion.div variants={itemVariants}>
          <MonthlySummaryCard 
            data={summary} 
            loading={loading.summary} 
            error={error.summary}
            cached={summary?.cached}
            generatedAt={summary?.generatedAt}
          />
        </motion.div>

        {/* Row 2: Savings & Anomalies (2 Cols) */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SavingsCard 
            data={savings} 
            loading={loading.savings} 
            error={error.savings}
            cached={savings?.cached}
            generatedAt={savings?.generatedAt}
          />
          <AnomalyCard 
            data={anomalies} 
            loading={loading.anomalies} 
            error={error.anomalies}
            cached={anomalies?.cached}
            generatedAt={anomalies?.generatedAt}
          />
        </motion.div>

        {/* Row 3: Patterns & Budget Advisor (2 Cols) */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PatternCard 
            data={patterns} 
            loading={loading.patterns} 
            error={error.patterns}
            cached={patterns?.cached}
            generatedAt={patterns?.generatedAt}
          />
          <BudgetAdvisorCard 
            data={budget}
            loading={loading.budget}
            error={error.budget}
            onFetchAdvice={fetchBudgetAdvice}
          />
        </motion.div>
      </div>

      {/* Insight History (Collapsible) */}
      <motion.div variants={itemVariants} className="mt-12 glass-panel rounded-3xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
        <button 
          onClick={() => setHistoryOpen(!historyOpen)}
          className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors relative z-10"
        >
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-white text-lg tracking-wide">Insight Generation History</h3>
            <span className="badge badge-primary">LOGS</span>
          </div>
          <motion.div
            animate={{ rotate: historyOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} className="text-surface-400" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {historyOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 border-t border-surface-700/50">
                <p className="text-sm text-surface-400 mb-6">
                  A log of your recent AI insight generations. Caching ensures we don't repeatedly call the AI service for the same data.
                </p>
                <div className="bg-surface-800/30 border border-surface-700/50 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-surface-800 rounded-full flex items-center justify-center mb-4">
                    <RefreshCw className="w-8 h-8 text-surface-600" />
                  </div>
                  <p className="text-surface-400 font-medium">History logs will appear here after generating insights.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </motion.div>
  );
};

export default Insights;
