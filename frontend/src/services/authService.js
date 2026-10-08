import api from './api';
import { mockUsers } from '../data/mockData';

export const authService = {
  login: async (email, password, role = 'student') => {
    try {
      const endpoint = role ? `/auth/${role}/login` : '/auth/login';
      const response = await api.post(endpoint, { email, password, role });
      return response.data;
    } catch (error) {
      // If server responded (e.g. 403 Pending Approval or 401 Invalid Credentials), rethrow so UI displays it
      if (error.response?.data) {
        throw error;
      }

      // Offline / Demo Fallback Mode (only when backend is completely offline)
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
    try {
      await api.post('/management/logout').catch(() => {});
      return { success: true };
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
