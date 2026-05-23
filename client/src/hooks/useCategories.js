import { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [userRules, setUserRules] = useState([]);
  const [systemRules, setSystemRules] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesRes, userRulesRes, systemRulesRes] = await Promise.allSettled([
        categoryService.getAllCategories(),
        categoryService.getUserRules(),
        categoryService.getSystemRules()
      ]);

      if (categoriesRes.status === 'fulfilled') setCategories(categoriesRes.value);
      if (userRulesRes.status === 'fulfilled') setUserRules(userRulesRes.value);
      if (systemRulesRes.status === 'fulfilled') setSystemRules(systemRulesRes.value.rules || []);
      
    } catch (err) {
      setError('Failed to fetch category data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addRule = async (data) => {
    setSaving(true);
    try {
      await categoryService.createRule(data);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create rule' };
    } finally {
      setSaving(false);
    }
  };

  const editRule = async (id, data) => {
    setSaving(true);
    try {
      await categoryService.updateRule(id, data);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update rule' };
    } finally {
      setSaving(false);
    }
  };

  const removeRule = async (id) => {
    setSaving(true);
    try {
      await categoryService.deleteRule(id);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete rule' };
    } finally {
      setSaving(false);
    }
  };

  const previewRule = async (pattern, type, merchants) => {
    try {
      const result = await categoryService.testRule({ pattern, type, merchants });
      return { success: true, results: result.results };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Test failed' };
    }
  };

  const runRecategorize = async () => {
    setSaving(true);
    try {
      const result = await categoryService.recategorizeExpenses();
      return { success: true, ...result };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to recategorize' };
    } finally {
      setSaving(false);
    }
  };

  return {
    categories,
    userRules,
    systemRules,
    loading,
    error,
    saving,
    fetchAll,
    addRule,
    editRule,
    removeRule,
    previewRule,
    runRecategorize
  };
};
