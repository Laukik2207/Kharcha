import api from './api';

export const getAvailableDates = async () => {
  const { data } = await api.get('/analytics/available-dates');
  return data.data;
};

const buildParams = (years, months, extra = {}) => {
  const params = { ...extra };
  if (years && years.length) params.years = years.join(',');
  if (months && months.length) params.months = months.join(',');
  return params;
};

export const getMonthlySummary = async (years, months) => {
  const { data } = await api.get('/analytics/monthly', { params: buildParams(years, months) });
  return data.data;
};

export const getCategorySummary = async (years, months) => {
  const { data } = await api.get('/analytics/categories', { params: buildParams(years, months) });
  return data.data;
};

export const getYearlySummary = async (years, months) => {
  const { data } = await api.get('/analytics/yearly', { params: buildParams(years, months) });
  return data.data;
};

export const getDailyTrend = async (years, months) => {
  const { data } = await api.get('/analytics/daily', { params: buildParams(years, months) });
  return data.data;
};

export const getTopMerchants = async (years, months, limit = 5) => {
  const { data } = await api.get('/analytics/merchants', { params: buildParams(years, months, { limit }) });
  return data.data;
};

export const getPaymentMethodBreakdown = async (years, months) => {
  const { data } = await api.get('/analytics/payment-methods', { params: buildParams(years, months) });
  return data.data;
};
