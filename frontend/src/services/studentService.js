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

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/student/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // ── Mood CRUD ─────────────────────────────────────────────────────────────
  createMood: async (mood, notes = '') => {
    const response = await api.post('/student/mood', { mood, notes });
    return response.data;
  },

  getMoods: async () => {
    const response = await api.get('/student/mood');
    return response.data;
  },

  getMoodById: async (id) => {
    const response = await api.get(`/student/mood/${id}`);
    return response.data;
  },

  updateMood: async (id, mood, notes) => {
    const response = await api.put(`/student/mood/${id}`, { mood, notes });
    return response.data;
  },

  deleteMood: async (id) => {
    const response = await api.delete(`/student/mood/${id}`);
    return response.data;
  },

  // ── Legacy aliases (keep for compatibility) ───────────────────────────────
  submitMoodCheck: async (moodData) => {
    const response = await api.post('/student/mood', moodData);
    return response.data;
  },

  getMoodHistory: async () => {
    const response = await api.get('/student/mood');
    return response.data;
  },

  submitWellbeingCheck: async (wellbeingData) => {
    const response = await api.post('/student/wellbeing-check', wellbeingData);
    return response.data;
  },

  getCounselors: async () => {
    const response = await api.get('/student/counselors');
    return response.data;
  },

  getCounselorById: async (counselorId) => {
    const response = await api.get(`/student/counselors/${counselorId}`);
    return response.data;
  },

  getCounselorAvailability: async (counselorId) => {
    const response = await api.get(`/student/counselors/${counselorId}/availability`);
    return response.data;
  },

  // ── Appointment CRUD ──────────────────────────────────────────────────────
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/student/appointments', appointmentData);
    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get('/student/appointments');
    return response.data;
  },

  getAppointmentById: async (appointmentId) => {
    const response = await api.get(`/student/appointments/${appointmentId}`);
    return response.data;
  },

  updateAppointment: async (appointmentId, updateData) => {
    const response = await api.put(`/student/appointments/${appointmentId}`, updateData);
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.delete(`/student/appointments/${appointmentId}`);
    return response.data;
  },

  getResources: async () => {
    const response = await api.get('/student/resources');
    return response.data;
  },

  getResourceById: async (resourceId) => {
    const response = await api.get(`/student/resources/${resourceId}`);
    return response.data;
  },

  submitConsentForm: async (consentData) => {
    const response = await api.post('/student/consent', consentData);
    return response.data;
  },
};
