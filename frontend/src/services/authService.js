import api from './api';
import { mockUsers } from '../data/mockData';

export const authService = {
  login: async (email, password, role = 'student') => {
    const endpoint = role ? `/auth/${role}/login` : '/auth/login';
    const response = await api.post(endpoint, { email, password, role });
    return response.data;
  },

  register: async (userData) => {
    // Route to the correct role endpoint
    const role = userData.role || 'student';
    const endpoint = `/auth/${role}/register`;
    const response = await api.post(endpoint, userData);
    return response.data;
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      return { success: true };
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error) {
      return { token: 'demo-jwt-token-refreshed' };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return { success: true };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      return { success: true };
    }
  }
};
