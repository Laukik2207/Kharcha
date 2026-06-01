import { useState, useEffect } from 'react';
import * as insightService from '../services/insightService';

export const useInsights = (options = {}) => {
  const { autoFetch = true, types = ['summary', 'savings', 'anomalies', 'patterns'] } = options;

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

  const fetchBudgetAdvice = async (budgetGoal) => {
    await fetchInsight('budget', insightService.getBudgetAdvice, budgetGoal);
  };

  const refreshAll = async () => {
    updateState('summary', { loading: true, error: null });
    updateState('savings', { loading: true, error: null });
    updateState('anomalies', { loading: true, error: null });
    updateState('patterns', { loading: true, error: null });

    try {
      const data = await insightService.refreshCompleteAnalysis(selectedMonth, selectedYear);
      updateState('summary', { data: data.summary, loading: false });
      updateState('savings', { data: data.savings, loading: false });
      updateState('anomalies', { data: data.anomalies, loading: false });
      updateState('patterns', { data: data.patterns, loading: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to refresh insights';
      updateState('summary', { error: errorMessage, loading: false });
      updateState('savings', { error: errorMessage, loading: false });
      updateState('anomalies', { error: errorMessage, loading: false });
      updateState('patterns', { error: errorMessage, loading: false });
    }
  };

  useEffect(() => {
    if (!autoFetch) return;

    let isMounted = true;
    
    const runFetch = async () => {
      if (!isMounted) return;

      if (types.includes('summary') && types.length === 1) {
        // Just fetching summary (e.g. Dashboard)
        await fetchInsight('summary', insightService.getMonthlySummary);
      } else {
        // Fetch everything via the combined endpoint to save API quota
        updateState('summary', { loading: true, error: null });
        updateState('savings', { loading: true, error: null });
        updateState('anomalies', { loading: true, error: null });
        updateState('patterns', { loading: true, error: null });

        try {
          const data = await insightService.getCompleteAnalysis(selectedMonth, selectedYear);
          if (isMounted) {
            updateState('summary', { data: data.summary, loading: false });
            updateState('savings', { data: data.savings, loading: false });
            updateState('anomalies', { data: data.anomalies, loading: false });
            updateState('patterns', { data: data.patterns, loading: false });
          }
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch insights';
          if (isMounted) {
            updateState('summary', { error: errorMessage, loading: false });
            updateState('savings', { error: errorMessage, loading: false });
            updateState('anomalies', { error: errorMessage, loading: false });
            updateState('patterns', { error: errorMessage, loading: false });
          }
        }
      }
    };
    
    runFetch();
    
    return () => {
      isMounted = false;
    };
  }, [selectedMonth, selectedYear, autoFetch]); // types array omitted intentionally to avoid infinite loops if passed inline

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
    fetchBudgetAdvice,
    refreshAll
  };
};
