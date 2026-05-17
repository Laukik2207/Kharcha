import axios from 'axios';
import { getAuth, signOut } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        // Force refresh if token is close to expiry
        const freshToken = await auth.currentUser.getIdToken(false);
        localStorage.setItem('kharcha_token', freshToken);
      }
    } catch (error) {
      // Ignore error if not logged in
    }

    const token = localStorage.getItem('kharcha_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const auth = getAuth();
        await signOut(auth);
      } catch (err) {
        console.error("Sign out error", err);
      }
      localStorage.removeItem('kharcha_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
