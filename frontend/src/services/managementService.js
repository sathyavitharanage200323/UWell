import api from './api';

export const managementService = {
  getProfile: async () => {
    const response = await api.get('/management/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/management/profile', profileData);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/management/dashboard');
    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get('/management/appointments');
    return response.data;
  },

  getUsageDetails: async () => {
    const response = await api.get('/management/usage-details');
    return response.data;
  },

  getUsageReport: async (filters) => {
    const response = await api.post('/management/usage-report', filters);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/management/users');
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/management/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/management/users/${userId}`);
    return response.data;
  },

  getSystemSettings: async () => {
    const response = await api.get('/management/settings');
    return response.data;
  },

  updateSystemSettings: async (settings) => {
    const response = await api.put('/management/settings', settings);
    return response.data;
  }
};
