import { useState, useEffect, useCallback } from 'react';
import * as unknownMerchantService from '../services/unknownMerchantService';

export const useUnknownMerchants = () => {
  const [unknownMerchants, setUnknownMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);
  const [assigning, setAssigning] = useState(false);

  const fetchUnknownMerchants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await unknownMerchantService.getUnknownMerchants();
      setUnknownMerchants(data.unknownMerchants || []);
      setTotalCount(data.totalCount || 0);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch unknown merchants');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCount = useCallback(async () => {
    try {
      const data = await unknownMerchantService.getUnknownCount();
      setUnknownCount(data.count || 0);
    } catch (err) {
      console.error('Failed to fetch unknown count', err);
    }
  }, []);

  const assign = async (merchant, category, createRule = true, ruleType = 'keyword') => {
    try {
      setAssigning(true);
      // Optimistic update
      setUnknownMerchants((prev) => prev.filter(m => m._id !== merchant));
      setTotalCount((prev) => Math.max(0, prev - 1));
      
      await unknownMerchantService.assignCategory({ merchant, category, createRule, ruleType });
      await fetchCount();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign category');
      // Re-fetch on failure to rollback optimistic update
      await fetchUnknownMerchants();
    } finally {
      setAssigning(false);
    }
  };

  const assignAll = async (assignments) => {
    try {
      setAssigning(true);
      await unknownMerchantService.assignCategoryBulk(assignments);
      await fetchUnknownMerchants();
      await fetchCount();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to bulk assign');
    } finally {
      setAssigning(false);
    }
  };

  const dismiss = async (merchant) => {
    try {
      setAssigning(true);
      // Optimistic update
      setUnknownMerchants((prev) => prev.filter(m => m._id !== merchant));
      setTotalCount((prev) => Math.max(0, prev - 1));

      await unknownMerchantService.dismissMerchant(merchant);
      await fetchCount();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dismiss merchant');
      await fetchUnknownMerchants();
    } finally {
      setAssigning(false);
    }
  };

  useEffect(() => {
    fetchUnknownMerchants();
    fetchCount();
  }, [fetchUnknownMerchants, fetchCount]);

  return {
    unknownMerchants,
    loading,
    error,
    totalCount,
    unknownCount,
    assigning,
    fetchUnknownMerchants,
    fetchCount,
    assign,
    assignAll,
    dismiss
  };
};
