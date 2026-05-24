import { useState, useEffect, useCallback } from 'react';
import * as insightService from '../services/insightService';

export const useInsights = () => {
  const [summary, setSummary] = useState(null);
  const [savings, setSavings] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [budget, setBudget] = useState(null);

  const [loading, setLoading] = useState({
    summary: false,
    savings: false,
    anomalies: false,
    patterns: false,
    budget: false
  });

  const [error, setError] = useState({
    summary: null,
    savings: null,
    anomalies: null,
    patterns: null,
    budget: null
  });

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const updateState = (type, stateUpdate) => {
    if (stateUpdate.loading !== undefined) {
      setLoading(prev => ({ ...prev, [type]: stateUpdate.loading }));
    }
    if (stateUpdate.error !== undefined) {
      setError(prev => ({ ...prev, [type]: stateUpdate.error }));
    }
    if (stateUpdate.data !== undefined) {
      switch(type) {
        case 'summary': setSummary(stateUpdate.data); break;
        case 'savings': setSavings(stateUpdate.data); break;
        case 'anomalies': setAnomalies(stateUpdate.data); break;
        case 'patterns': setPatterns(stateUpdate.data); break;
        case 'budget': setBudget(stateUpdate.data); break;
      }
    }
  };

  const fetchInsight = async (type, fetcher, ...args) => {
    updateState(type, { loading: true, error: null });
    try {
      const data = await fetcher(...args, selectedMonth, selectedYear);
      updateState(type, { data, loading: false });
      return { status: 'fulfilled', value: data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch insight';
      updateState(type, { error: errorMessage, loading: false });
      return { status: 'rejected', reason: err };
    }
  };

  const fetchAll = useCallback(async () => {
    // Fire all fetch requests in parallel
    await Promise.allSettled([
      fetchInsight('summary', insightService.getMonthlySummary),
      fetchInsight('savings', insightService.getSavingsRecommendations),
      fetchInsight('anomalies', insightService.getAnomalyDetection),
      fetchInsight('patterns', insightService.getSpendingPatterns)
    ]);
  }, [selectedMonth, selectedYear]);

  const fetchBudgetAdvice = async (budgetGoal) => {
    await fetchInsight('budget', insightService.getBudgetAdvice, budgetGoal);
  };

  const refresh = async (type) => {
    updateState(type, { loading: true, error: null });
    
    // Map local state type to backend type enum
    const typeMap = {
      summary: 'monthly_summary',
      savings: 'savings',
      anomalies: 'anomalies',
      patterns: 'patterns'
    };

    try {
      const data = await insightService.refreshInsight(typeMap[type], selectedMonth, selectedYear);
      updateState(type, { data, loading: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to refresh insight';
      updateState(type, { error: errorMessage, loading: false });
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    summary,
    savings,
    anomalies,
    patterns,
    budget,
    loading,
    error,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    fetchAll,
    fetchBudgetAdvice,
    refresh
  };
};
