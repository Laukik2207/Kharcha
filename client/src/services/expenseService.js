import api from './api';

export const getExpenses = async (params) => {
  const { data } = await api.get('/expenses', { params });
  return data;
};

export const getExpenseSummary = async (params) => {
  const { data } = await api.get('/expenses/summary', { params });
  return data;
};

export const getExpenseById = async (id) => {
  const { data } = await api.get(`/expenses/${id}`);
  return data;
};

export const createExpense = async (expenseData) => {
  const { data } = await api.post('/expenses', expenseData);
  return data;
};

export const updateExpense = async (id, expenseData) => {
  const { data } = await api.put(`/expenses/${id}`, expenseData);
  return data;
};

export const deleteExpense = async (id) => {
  const { data } = await api.delete(`/expenses/${id}`);
  return data;
};
