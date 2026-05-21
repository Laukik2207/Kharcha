import { useState, useEffect, useCallback } from 'react';
import * as analyticsService from '../services/analyticsService';

export const useAnalytics = () => {
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [categorySummary, setCategorySummary] = useState(null);
  const [yearlySummary, setYearlySummary] = useState(null);
  const [dailyTrend, setDailyTrend] = useState(null);
  const [topMerchants, setTopMerchants] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);

  const [loading, setLoading] = useState({
    monthly: false,
    categories: false,
    yearly: false,
    daily: false,
    merchants: false,
    payments: false
  });

  const [error, setError] = useState(null);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const fetchMonthly = async () => {
    setLoading(p => ({ ...p, monthly: true }));
    try {
      const data = await analyticsService.getMonthlySummary(selectedYear);
      setMonthlySummary(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch monthly summary');
    } finally {
      setLoading(p => ({ ...p, monthly: false }));
    }
  };

  const fetchCategories = async () => {
    setLoading(p => ({ ...p, categories: true }));
    try {
      const data = await analyticsService.getCategorySummary(selectedMonth, selectedYear);
      setCategorySummary(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch category summary');
    } finally {
      setLoading(p => ({ ...p, categories: false }));
    }
  };

  const fetchYearly = async () => {
    setLoading(p => ({ ...p, yearly: true }));
    try {
      const data = await analyticsService.getYearlySummary();
      setYearlySummary(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch yearly summary');
    } finally {
      setLoading(p => ({ ...p, yearly: false }));
    }
  };

  const fetchDaily = async () => {
    setLoading(p => ({ ...p, daily: true }));
    try {
      const data = await analyticsService.getDailyTrend(selectedMonth, selectedYear);
      setDailyTrend(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch daily trend');
    } finally {
      setLoading(p => ({ ...p, daily: false }));
    }
  };

  const fetchMerchants = async () => {
    setLoading(p => ({ ...p, merchants: true }));
    try {
      const data = await analyticsService.getTopMerchants(selectedMonth, selectedYear, 5);
      setTopMerchants(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch top merchants');
    } finally {
      setLoading(p => ({ ...p, merchants: false }));
    }
  };

  const fetchPayments = async () => {
    setLoading(p => ({ ...p, payments: true }));
    try {
      const data = await analyticsService.getPaymentMethodBreakdown(selectedMonth, selectedYear);
      setPaymentMethods(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch payment methods');
    } finally {
      setLoading(p => ({ ...p, payments: false }));
    }
  };

  const fetchAll = useCallback(() => {
    setError(null);
    Promise.allSettled([
      fetchMonthly(),
      fetchCategories(),
      fetchYearly(),
      fetchDaily(),
      fetchMerchants(),
      fetchPayments()
    ]);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    monthlySummary,
    categorySummary,
    yearlySummary,
    dailyTrend,
    topMerchants,
    paymentMethods,
    loading,
    error,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    refetch: fetchAll
  };
};
