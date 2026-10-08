import api from './api';

export const welfareService = {
  // ── Profile ───────────────────────────────────────────────────────────────
  getProfile: async () => {
    const response = await api.get('/welfare/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/welfare/profile', profileData);
    return response.data;
  },

  // ── Schedule ──────────────────────────────────────────────────────────────
  updateSchedule: async (scheduleData) => {
    const response = await api.put('/welfare/schedule', scheduleData);
    return response.data;
  },

  // ── Staff Lookup ──────────────────────────────────────────────────────────
  getByStaffId: async (staffId) => {
    const response = await api.get(`/welfare/staff/${encodeURIComponent(staffId)}`);
    return response.data;
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  getDashboardStats: async () => {
    const response = await api.get('/welfare/dashboard');
    return response.data;
  },

  // ── Appointments ──────────────────────────────────────────────────────────
  getAppointments: async () => {
    const response = await api.get('/welfare/appointments');
    return response.data;
  },

  getAppointmentDetails: async (appointmentId) => {
    const response = await api.get(`/welfare/appointments/${appointmentId}`);
    return response.data;
  },

  updateAppointment: async (appointmentId, changes) => {
    const response = await api.put(`/welfare/appointments/${appointmentId}`, changes);
    return response.data;
  },

  deleteAppointment: async (appointmentId) => {
    const response = await api.delete(`/welfare/appointments/${appointmentId}`);
    return response.data;
  },

  // ── Counseling Services ───────────────────────────────────────────────────
  getCounselingServices: async () => {
    const response = await api.get('/welfare/services/counseling');
    return response.data;
  },

  updateCounselorStatus: async (counselorId, status) => {
    const response = await api.put(`/welfare/counselor/${counselorId}/status`, { status });
    return response.data;
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  getNotifications: async () => {
    const response = await api.get('/welfare/notifications');
    return response.data;
  },

  markNotificationRead: async (notificationId) => {
    const response = await api.put(`/welfare/notifications/${notificationId}/read`);
    return response.data;
  },
};

