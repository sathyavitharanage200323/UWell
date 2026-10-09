import api from './api';
import { mockUsers } from '../data/mockData';

export const authService = {
  login: async (email, password, role = 'student') => {
    try {
      const endpoint = role ? `/auth/${role}/login` : '/auth/login';
      const response = await api.post(endpoint, { email, password, role });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error;
      }

      const userRole = role || 'student';
      let userData;

      if (userRole === 'counselor') {
        const counselor = mockUsers.counselors[0];
        userData = {
          ...counselor,
          name: `${counselor.firstName} ${counselor.lastName}`,
          role: 'counselor'
        };
      } else if (userRole === 'student') {
        const student = mockUsers.students[0];
        userData = {
          ...student,
          name: `${student.firstName} ${student.lastName}`,
          role: 'student'
        };
      } else if (userRole === 'welfare') {
        const welfare = mockUsers.welfare[0];
        userData = {
          ...welfare,
          name: `${welfare.firstName} ${welfare.lastName}`,
          role: 'welfare'
        };
      } else if (userRole === 'management') {
        const management = mockUsers.management[0];
        userData = {
          ...management,
          name: `${management.firstName} ${management.lastName}`,
          role: 'management'
        };
      } else {
        throw error;
      }

      return {
        user: userData,
        token: 'demo-jwt-token-12345'
      };
    }
  },

  register: async (userData) => {
    // Route to the correct role endpoint
    const role = userData.role || 'student';
    const endpoint = `/auth/${role}/register`;
    const response = await api.post(endpoint, userData);
    return response.data;
  },

  // ── Management Approval Workflows ─────────────────────────────────────────
  getPendingRequests: async () => {
    const response = await api.get('/management/pending-requests');
    return response.data;
  },

  getAllRequests: async (params) => {
    const response = await api.get('/management/all-requests', { params });
    return response.data;
  },

  approveRequest: async (userId, role) => {
    const response = await api.post('/management/approve-request', { userId, role });
    return response.data;
  },

  rejectRequest: async (userId, role, reason = '') => {
    const response = await api.post('/management/reject-request', { userId, role, reason });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/management/dashboard-stats');
    return response.data;
  },

  getManagementProfile: async (params = {}) => {
    try {
      const response = await api.get('/management/profile', { params });
      return response.data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateManagementProfile: async (data) => {
    const response = await api.put('/management/profile', data);
    return response.data;
  },

  logout: async () => {
    // Authentication is JWT-based; clearing local credentials completes logout.
    return { success: true };
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
