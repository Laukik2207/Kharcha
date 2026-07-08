import { useState, useEffect, useCallback } from 'react';
import * as analyticsService from '../services/analyticsService';

/**
 * Custom React hook for managing complex analytics data fetching and state.
 * Handles loading states, errors, and data fetching for various chart components.
 * Automatically synchronizes with selected date filters (years and months).
 * 
 * @returns {Object} State and control functions (data objects, loading object, error string, fetch triggers)
 */
export const useAnalytics = () => {
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [categorySummary, setCategorySummary] = useState(null);
  const [yearlySummary, setYearlySummary] = useState(null);
  const [dailyTrend, setDailyTrend] = useState(null);
  const [topMerchants, setTopMerchants] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  const [loading, setLoading] = useState({
    monthly: false,
    categories: false,
    yearly: false,
    daily: false,
    merchants: false,
    payments: false,
    dates: false
  });

  const [error, setError] = useState(null);

  const currentDate = new Date();
  const [selectedYears, setSelectedYears] = useState([currentDate.getFullYear()]);
  const [selectedMonths, setSelectedMonths] = useState([]); // Empty means ALL months available

  const fetchAvailableDates = async () => {
    setLoading(p => ({ ...p, dates: true }));
    try {
      const data = await analyticsService.getAvailableDates();
      setAvailableDates(data || []);
      // Auto-select the most recent year if nothing is set
      if (data && data.length > 0 && selectedYears.length === 0) {
        setSelectedYears([data[0].year]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(p => ({ ...p, dates: false }));
    }
  };

  const fetchMonthly = async () => {
    setLoading(p => ({ ...p, monthly: true }));
    try {
      const data = await analyticsService.getMonthlySummary(selectedYears, selectedMonths);
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
      const data = await analyticsService.getCategorySummary(selectedYears, selectedMonths);
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
      const data = await analyticsService.getYearlySummary(selectedYears, selectedMonths);
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
      const data = await analyticsService.getDailyTrend(selectedYears, selectedMonths);
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
      const data = await analyticsService.getTopMerchants(selectedYears, selectedMonths, 5);
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
      const data = await analyticsService.getPaymentMethodBreakdown(selectedYears, selectedMonths);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYears, selectedMonths]);

  useEffect(() => {
    fetchAvailableDates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    availableDates,
    loading,
    error,
    selectedYears,
    selectedMonths,
    setSelectedYears,
    setSelectedMonths,
    refetch: fetchAll
  };
};
