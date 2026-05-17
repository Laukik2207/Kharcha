import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCurrentUser, loginUser as apiLogin, registerUser as apiRegister } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('kharcha_token');
    if (token) {
      try {
        const response = await fetchCurrentUser();
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        localStorage.removeItem('kharcha_token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await apiLogin(credentials);
      localStorage.setItem('kharcha_token', response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await apiRegister(userData);
      localStorage.setItem('kharcha_token', response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('kharcha_token');
    setUser(null);
    window.location.href = '/login';
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};
