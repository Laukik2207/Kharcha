import api from './api';

export const getUnknownMerchants = async () => {
  const response = await api.get('/unknown-merchants');
  return response.data.data;
};

export const getUnknownCount = async () => {
  const response = await api.get('/unknown-merchants/count');
  return response.data.data;
};

export const assignCategory = async (data) => {
  const response = await api.post('/unknown-merchants/assign', data);
  return response.data.data;
};

export const assignCategoryBulk = async (assignments) => {
  const response = await api.post('/unknown-merchants/assign-bulk', { assignments });
  return response.data.data;
};

export const dismissMerchant = async (merchant) => {
  const response = await api.post('/unknown-merchants/dismiss', { merchant });
  return response.data.data;
};
