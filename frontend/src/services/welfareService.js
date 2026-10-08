import api from './api';

export const welfareService = {
  getProfile: async () => {
    const response = await api.get('/welfare/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/welfare/profile', profileData);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/welfare/dashboard');
    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get('/welfare/appointments');
    return response.data;
  },

  getAppointmentDetails: async (appointmentId) => {
    const response = await api.get(`/welfare/appointments/${appointmentId}`);
    return response.data;
  },

  getStudents: async () => {
    const response = await api.get('/welfare/students');
    return response.data;
  },

  getStudentDetails: async (studentId) => {
    const response = await api.get(`/welfare/students/${studentId}`);
    return response.data;
  },

  getServices: async () => {
    const response = await api.get('/welfare/services');
    return response.data;
  },

  getServiceDetails: async (serviceId) => {
    const response = await api.get(`/welfare/services/${serviceId}`);
    return response.data;
  },

  createService: async (serviceData) => {
    const response = await api.post('/welfare/services', serviceData);
    return response.data;
  },

  updateService: async (serviceId, serviceData) => {
    const response = await api.put(`/welfare/services/${serviceId}`, serviceData);
    return response.data;
  },

  deleteService: async (serviceId) => {
    const response = await api.delete(`/welfare/services/${serviceId}`);
    return response.data;
  }
};
