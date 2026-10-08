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
        name: role === 'counselor' ? 'Dr. Evelyn Martinez' : 'Demo User',
        firstName: role === 'counselor' ? 'Evelyn' : 'Demo',
        lastName: role === 'counselor' ? 'Martinez' : 'User'
      };

      if (role === 'counselor') {
        const counselor = mockUsers.counselors[0];
        userData = {
          ...counselor,
          name: `${counselor.firstName} ${counselor.lastName}`,
          role: 'counselor'
        };
      } else if (role === 'student') {
        const student = mockUsers.students[0];
        userData = {
          ...student,
          name: `${student.firstName} ${student.lastName}`
        };
      } else if (role === 'welfare') {
        const welfare = mockUsers.welfare[0];
        userData = {
          ...welfare,
          name: `${welfare.firstName} ${welfare.lastName}`
        };
      } else if (role === 'management') {
        const mgmt = mockUsers.management[0];
        userData = {
          ...mgmt,
          name: `${mgmt.firstName} ${mgmt.lastName}`
        };
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
