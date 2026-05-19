import { useState, useEffect, useCallback } from 'react';
import * as expenseService from '../services/expenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const defaultFilters = {
    search: '',
    category: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  };

  const [filters, setFilters] = useState(defaultFilters);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Clean up empty filters before sending
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
      );
      
      const response = await expenseService.getExpenses(cleanFilters);
      
      if (response.success) {
        setExpenses(response.data.expenses);
        setTotalCount(response.data.totalCount);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } else {
        throw new Error(response.message || 'Failed to fetch expenses');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const setFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset page to 1 whenever any filter changes, unless the filter being changed IS the page
      ...(key !== 'page' ? { page: 1 } : {})
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const addExpense = async (data) => {
    try {
      await expenseService.createExpense(data);
      fetchExpenses(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.message 
      };
    }
  };

  const editExpense = async (id, data) => {
    try {
      await expenseService.updateExpense(id, data);
      fetchExpenses();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.message 
      };
    }
  };

  const removeExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      fetchExpenses();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.message 
      };
    }
  };

  return {
    expenses,
    loading,
    error,
    totalCount,
    totalPages,
    currentPage,
    filters,
    fetchExpenses,
    setFilter,
    resetFilters,
    addExpense,
    editExpense,
    removeExpense
  };
};
