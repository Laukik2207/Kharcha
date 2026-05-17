import api from './api';

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const updateUserProfile = async (updates) => {
  const { data } = await api.put('/auth/profile', updates);
  return data;
};
