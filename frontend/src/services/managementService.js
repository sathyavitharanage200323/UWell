import api from './api';

// Approval requests, dashboard stats and profile live in authService.
// This service covers the appointment summary and usage reports.
export const managementService = {
  // ── Appointment Summary ───────────────────────────────────────────────────
  getAppointments: async (params = {}) => {
    const response = await api.get('/management/appointments', { params });
    return response.data;
  },

  updateAppointment: async (appointmentId, changes) => {
    const response = await api.put(`/management/appointments/${appointmentId}`, changes);
    return response.data;
  },

  // ── Usage Reports ─────────────────────────────────────────────────────────
  generateUsageReport: async (type, range) => {
    const response = await api.post('/management/usage-report', { type, range });
    return response.data;
  },

  saveUsageReport: async (type, range) => {
    const response = await api.post('/management/reports', { type, range });
    return response.data;
  },

  getSavedReports: async () => {
    const response = await api.get('/management/reports');
    return response.data;
  },

  deleteSavedReport: async (reportId) => {
    const response = await api.delete(`/management/reports/${reportId}`);
    return response.data;
  },

  // ── Usage Details & Service Notes ─────────────────────────────────────────
  getUsageDetails: async () => {
    const response = await api.get('/management/usage-details');
    return response.data;
  },

  addServiceNote: async (department, text) => {
    const response = await api.post('/management/usage-details/notes', { department, text });
    return response.data;
  },

  deleteServiceNote: async (noteId) => {
    const response = await api.delete(`/management/usage-details/notes/${noteId}`);
    return response.data;
  },

  // ── Privacy & Security ────────────────────────────────────────────────────
  getSecurityInfo: async () => {
    const response = await api.get('/management/security');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/management/password', { currentPassword, newPassword });
    return response.data;
  },
};

export default managementService;
