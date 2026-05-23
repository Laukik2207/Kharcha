import api from './api';

const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  },

  getUserRules: async () => {
    const response = await api.get('/categories/rules');
    return response.data.data;
  },

  getSystemRules: async () => {
    const response = await api.get('/categories/rules/system');
    return response.data.data;
  },

  createRule: async (data) => {
    const response = await api.post('/categories/rules', data);
    return response.data.data;
  },

  updateRule: async (id, data) => {
    const response = await api.put(`/categories/rules/${id}`, data);
    return response.data.data;
  },

  deleteRule: async (id) => {
    const response = await api.delete(`/categories/rules/${id}`);
    return response.data.data;
  },

  testRule: async (data) => {
    const response = await api.post('/categories/rules/test', data);
    return response.data.data;
  },

  recategorizeExpenses: async () => {
    const response = await api.post('/categories/recategorize');
    return response.data.data;
  }
};

export default categoryService;
