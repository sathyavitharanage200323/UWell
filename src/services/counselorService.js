import api from './api';
import {
  initialCounselorProfile,
  initialPerformanceStats,
  initialAppointments,
  initialStudents,
  initialMessages,
  initialAvailabilitySchedule
} from '../data/counselorMockData';

// Local reactive storage for development & offline mode
let profileData = { ...initialCounselorProfile };
let appointmentsData = [...initialAppointments];
let studentsData = [...initialStudents];
let messagesData = [...initialMessages];
let availabilityData = [...initialAvailabilitySchedule];

export const counselorService = {
  // Counselor Profile
  getCounselorProfile: async () => {
    try {
      const response = await api.get('/counselor/profile');
      return response.data;
    } catch (error) {
      return profileData;
    }
  },

  updateCounselorProfile: async (updatedData) => {
    try {
      const response = await api.put('/counselor/profile', updatedData);
      return response.data;
    } catch (error) {
      profileData = { ...profileData, ...updatedData };
      return profileData;
    }
  },

  // Performance Stats
  getPerformanceStats: async () => {
    try {
      const response = await api.get('/counselor/stats');
      return response.data;
    } catch (error) {
      return initialPerformanceStats;
    }
  },

  // Appointments
  getAppointments: async () => {
    try {
      const response = await api.get('/counselor/appointments');
      return response.data;
    } catch (error) {
      return appointmentsData;
    }
  },

  getAppointmentById: async (appointmentId) => {
    try {
      const response = await api.get(`/counselor/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      return appointmentsData.find((a) => a.id === appointmentId) || appointmentsData[0];
    }
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const response = await api.put(`/counselor/appointments/${appointmentId}`, { status });
      return response.data;
    } catch (error) {
      appointmentsData = appointmentsData.map((a) =>
        a.id === appointmentId ? { ...a, status } : a
      );
      return appointmentsData.find((a) => a.id === appointmentId);
    }
  },

  // Students
  getStudents: async () => {
    try {
      const response = await api.get('/counselor/students');
      return response.data;
    } catch (error) {
      return studentsData;
    }
  },

  getStudentById: async (studentId) => {
    try {
      const response = await api.get(`/counselor/students/${studentId}`);
      return response.data;
    } catch (error) {
      return studentsData.find((s) => s.id === studentId) || studentsData[0];
    }
  },

  saveSessionNotes: async (studentId, notes) => {
    try {
      const response = await api.post(`/counselor/students/${studentId}/notes`, { notes });
      return response.data;
    } catch (error) {
      studentsData = studentsData.map((s) =>
        s.id === studentId ? { ...s, sessionNotesHistory: notes } : s
      );
      const updated = studentsData.find((s) => s.id === studentId) || { success: true, notes };
      return updated;
    }
  },

  // Messages & Student Chat
  getMessages: async () => {
    try {
      const response = await api.get('/counselor/messages');
      return response.data;
    } catch (error) {
      return messagesData;
    }
  },

  getMessageByStudentId: async (studentId) => {
    try {
      const response = await api.get(`/counselor/messages/${studentId}`);
      return response.data;
    } catch (error) {
      return (
        messagesData.find((m) => m.studentId === studentId) ||
        messagesData[0]
      );
    }
  },

  sendMessage: async (studentId, text) => {
    try {
      const response = await api.post('/counselor/messages', { studentId, text });
      return response.data;
    } catch (error) {
      const newMsg = {
        id: `c-${Date.now()}`,
        sender: 'counselor',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      messagesData = messagesData.map((m) => {
        if (m.studentId === studentId || m.id === studentId) {
          return {
            ...m,
            lastMessage: text,
            timestamp: 'Just now',
            chatHistory: [...(m.chatHistory || []), newMsg]
          };
        }
        return m;
      });

      return newMsg;
    }
  },

  // Availability CRUD
  getAvailability: async () => {
    try {
      const response = await api.get('/counselor/availability');
      return response.data;
    } catch (error) {
      return availabilityData;
    }
  },

  createAvailability: async (slotData) => {
    try {
      const response = await api.post('/counselor/availability', slotData);
      return response.data;
    } catch (error) {
      const newSlot = {
        id: `av-${Date.now()}`,
        day: slotData.day,
        active: true,
        startTime: slotData.startTime,
        endTime: slotData.endTime,
        slots: slotData.slots || [slotData.startTime]
      };
      // If day exists, replace or append
      const existingIndex = availabilityData.findIndex((a) => a.day.toLowerCase() === slotData.day.toLowerCase());
      if (existingIndex !== -1) {
        availabilityData[existingIndex] = { ...availabilityData[existingIndex], ...newSlot };
      } else {
        availabilityData.push(newSlot);
      }
      return newSlot;
    }
  },

  updateAvailability: async (id, updatedFields) => {
    try {
      const response = await api.put(`/counselor/availability/${id}`, updatedFields);
      return response.data;
    } catch (error) {
      availabilityData = availabilityData.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item
      );
      return availabilityData.find((item) => item.id === id);
    }
  },

  deleteAvailability: async (id) => {
    try {
      await api.delete(`/counselor/availability/${id}`);
      return { success: true };
    } catch (error) {
      availabilityData = availabilityData.filter((item) => item.id !== id);
      return { success: true };
    }
  },

  // Video Session placeholder launcher
  startVideoSession: async (appointmentId) => {
    try {
      const response = await api.post(`/counselor/video-session/start`, { appointmentId });
      return response.data;
    } catch (error) {
      return {
        sessionId: `vid-${Date.now()}`,
        status: 'active',
        joinUrl: 'uwell-video://session-placeholder'
      };
    }
  }
};
