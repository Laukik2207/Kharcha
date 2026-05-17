import api from './api';

export const syncUser = async () => {
  const { data } = await api.post('/auth/sync');
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
