import api from './api';
import { mockUsers } from '../data/mockData';

export const authService = {
  login: async (email, password, role) => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      return response.data;
    } catch (error) {
      // Offline / Demo Fallback Mode
      let userData = {
        id: 1,
        email: email || 'e.martinez@university.edu',
        role: role || 'counselor',
        name: role === 'counselor' ? 'Dr. Evelyn Martinez' : 'Demo User'
      };

      if (role === 'counselor') {
        userData = {
          ...mockUsers.counselors[0],
          name: 'Dr. Evelyn Martinez',
          role: 'counselor'
        };
      } else if (role === 'student') {
        userData = mockUsers.students[0];
      } else if (role === 'welfare') {
        userData = mockUsers.welfare[0];
      } else if (role === 'management') {
        userData = mockUsers.management[0];
      }

      return {
        user: userData,
        token: 'demo-jwt-token-12345'
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      return {
        user: { ...userData, id: Date.now() },
        token: 'demo-jwt-token-12345'
      };
    }
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
