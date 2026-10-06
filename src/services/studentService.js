import api from './api';

export const studentService = {
  getProfile: async () => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/student/profile', profileData);
    return response.data;
  },

  submitMoodCheck: async (moodData) => {
    const response = await api.post('/student/mood-check', moodData);
    return response.data;
  },

  getMoodHistory: async () => {
    const response = await api.get('/student/mood-history');
    return response.data;
  },

  getCounselors: async () => {
    const response = await api.get('/student/counselors');
    return response.data;
  },

  getCounselorAvailability: async (counselorId) => {
    const response = await api.get(`/student/counselors/${counselorId}/availability`);
    return response.data;
  },

  bookAppointment: async (appointmentData) => {
    const response = await api.post('/student/appointments', appointmentData);
    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get('/student/appointments');
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.delete(`/student/appointments/${appointmentId}`);
    return response.data;
  },

  getResources: async () => {
    const response = await api.get('/student/resources');
    return response.data;
  }
};
