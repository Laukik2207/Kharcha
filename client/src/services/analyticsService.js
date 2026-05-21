import api from './api';

export const getMonthlySummary = async (year) => {
  const { data } = await api.get('/analytics/monthly', { params: { year } });
  return data.data;
};

export const getCategorySummary = async (month, year) => {
  const { data } = await api.get('/analytics/categories', { params: { month, year } });
  return data.data;
};

export const getYearlySummary = async () => {
  const { data } = await api.get('/analytics/yearly');
  return data.data;
};

export const getDailyTrend = async (month, year) => {
  const { data } = await api.get('/analytics/daily', { params: { month, year } });
  return data.data;
};

export const getTopMerchants = async (month, year, limit) => {
  const { data } = await api.get('/analytics/merchants', { params: { month, year, limit } });
  return data.data;
};

export const getPaymentMethodBreakdown = async (month, year) => {
  const { data } = await api.get('/analytics/payment-methods', { params: { month, year } });
  return data.data;
};
