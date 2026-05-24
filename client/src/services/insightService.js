import api from './api';

export const getMonthlySummary = async (month, year) => {
  const response = await api.get('/insights/summary', { params: { month, year } });
  return response.data.data;
};

export const getSavingsRecommendations = async (month, year) => {
  const response = await api.get('/insights/savings', { params: { month, year } });
  return response.data.data;
};

export const getAnomalyDetection = async (month, year) => {
  const response = await api.get('/insights/anomalies', { params: { month, year } });
  return response.data.data;
};

export const getSpendingPatterns = async (month, year) => {
  const response = await api.get(`/insights/patterns?month=${month}&year=${year}`);
  return response.data.data;
};

export const getCompleteAnalysis = async (month, year) => {
  const response = await api.get(`/insights/all?month=${month}&year=${year}`);
  return response.data.data;
};

export const getBudgetAdvice = async (budgetGoal, month, year) => {
  const response = await api.post('/insights/budget', { budgetGoal, month, year });
  return response.data.data;
};

export const refreshInsight = async (type, month, year) => {
  const response = await api.post('/insights/refresh', { type, month, year });
  return response.data.data;
};

export const getInsightHistory = async () => {
  const response = await api.get('/insights/history');
  return response.data.data;
};
