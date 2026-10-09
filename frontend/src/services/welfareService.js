import api from './api';
import { API_BASE_URL } from '../utils/constants';

/**
 * Resolves relative avatar paths (/uploads/...) to fully qualified URLs.
 * Handles data URIs, local file URIs, remote web URLs, and relative paths.
 */
export const resolveProfileImageUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image') ||
    trimmed.startsWith('file://')
  ) {
    return trimmed;
  }

  // Relative path on server (e.g., /uploads/welfare-photos/...)
  const serverOrigin = (API_BASE_URL || 'http://192.168.1.12:8082/api').replace(/\/api\/?$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${serverOrigin}${cleanPath}`;
};

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

  uploadProfilePhoto: async (formDataOrData) => {
    if (formDataOrData instanceof FormData) {
      const response = await api.post('/welfare/profile/photo', formDataOrData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }
    const response = await api.post('/welfare/profile/photo', formDataOrData);
    return response.data;
  },

  deleteProfilePhoto: async () => {
    const response = await api.delete('/welfare/profile/photo');
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

  getAllOfficers: async () => {
    const response = await api.get('/welfare/all');
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
