import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { welfareService } from '../services/welfareService';
import {
  welfareAppointments as initialAppointments,
  welfareNotifications as initialNotifications,
  welfareOfficer as initialOfficer,
  privacySecurityData as initialPrivacy
} from '../data/welfareMockData';

const STORAGE_KEYS = {
  APPOINTMENTS: '@uwell/welfare_appointments',
  NOTIFICATIONS: '@uwell/welfare_notifications',
  PROFILE: '@uwell/welfare_profile',
  PRIVACY: '@uwell/welfare_privacy'
};

const WelfareContext = createContext(null);

export const WelfareProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [privacy, setPrivacy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Build a profile object from the real logged-in welfare user
  const buildProfileFromAuth = (u) => ({
    id: u._id || u.id || 'wo-live',
    name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Welfare Officer',
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    role: u.position || 'Welfare Officer',
    department: u.department || 'Student Welfare Services',
    position: u.position || 'Welfare Officer',
    email: u.email || '',
    phone: u.phone || '',
    officeLocation: u.officeLocation || '',
    staffId: u.staffId || '',
    approvalStatus: u.approvalStatus || (u.isApproved ? 'approved' : 'pending'),
    isApproved: !!u.isApproved,
    approvedBy: u.approvedBy || 'Management Admin',
    approvedAt: u.approvedAt || null,
    bio: u.bio || 'Dedicated to supporting university student wellbeing, mental health initiatives, and student advocacy.',
    specializations: Array.isArray(u.specializations) && u.specializations.length > 0
      ? u.specializations
      : ['Student Wellbeing', 'Financial Aid Guidance', 'Housing Support', 'Crisis Intervention'],
    officeHours: u.officeHours || 'Monday – Friday, 8:30 AM – 4:30 PM',
    qualifications: u.qualifications || 'BSc in Social Work / Student Counseling',
    yearsOfExperience: u.yearsOfExperience || '3+ Years',
    languages: Array.isArray(u.languages) && u.languages.length > 0 ? u.languages : ['English', 'Sinhala'],
    emergencyContactPhone: u.emergencyContactPhone || '',
    workingSchedule: u.workingSchedule || 'Full-time On Campus',
    availabilityStatus: u.availabilityStatus || 'Available Today',
    workingDays: Array.isArray(u.workingDays) && u.workingDays.length > 0
      ? u.workingDays
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    consultationMode: u.consultationMode || 'In-Person & Online',
    emergencyAvailable: u.emergencyAvailable !== undefined ? !!u.emergencyAvailable : true,
    availabilityNote: u.availabilityNote || '',
    avatarInitials: `${(u.firstName || 'W')[0] || 'W'}${(u.lastName || 'O')[0] || 'O'}`.toUpperCase(),
  });

  useEffect(() => {
    loadAllData();
  }, []);

  // When authUser changes (e.g. after login), update the profile with real data and fetch latest from backend
  useEffect(() => {
    if (authUser && (authUser.role === 'welfare' || authUser.staffId)) {
      const realProfile = buildProfileFromAuth(authUser);
      setProfile(realProfile);
      AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(realProfile)).catch(() => {});

      // Fetch fresh profile from backend if online
      welfareService.getProfile()
        .then((res) => {
          if (res?.user) {
            const synced = buildProfileFromAuth(res.user);
            setProfile(synced);
            AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(synced)).catch(() => {});
          }
        })
        .catch(() => {});
    }
  }, [authUser]);

  const loadAllData = async () => {
    try {
      const [aptData, notifData, profileData, privacyData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.APPOINTMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.PRIVACY)
      ]);

      const apt = aptData ? JSON.parse(aptData) : initialAppointments;
      const notif = notifData ? JSON.parse(notifData) : initialNotifications;
      // Profile: prefer real auth user over stored/mock data
      let prof;
      if (authUser && (authUser.role === 'welfare' || authUser.staffId)) {
        prof = buildProfileFromAuth(authUser);
      } else {
        prof = profileData ? JSON.parse(profileData) : initialOfficer;
      }
      const priv = privacyData ? JSON.parse(privacyData) : initialPrivacy;

      setAppointments(apt);
      setNotifications(notif);
      setProfile(prof);
      setPrivacy(priv);

      if (!aptData) await AsyncStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(initialAppointments));
      if (!notifData) await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
      if (!profileData) await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialOfficer));
      if (!privacyData) await AsyncStorage.setItem(STORAGE_KEYS.PRIVACY, JSON.stringify(initialPrivacy));
    } catch (error) {
      console.error('WelfareContext load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ----- APPOINTMENTS: READ -----
  const getAppointments = (filter = 'All') => {
    if (filter === 'All') return appointments;
    return appointments.filter((a) => a.status === filter);
  };

  const getAppointmentById = (id) => appointments.find((a) => a.id === id);

  // ----- APPOINTMENTS: UPDATE -----
  const updateAppointment = async (id, changes) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, ...changes } : a));
    setAppointments(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    } catch (error) {
      console.error('updateAppointment error:', error);
    }
  };

  // ----- APPOINTMENTS: DELETE (soft — status becomes Cancelled) -----
  const cancelAppointment = async (id) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: 'Cancelled' } : a
    );
    setAppointments(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    } catch (error) {
      console.error('cancelAppointment error:', error);
    }
  };

  // ----- APPOINTMENTS: DELETE (hard remove) -----
  const deleteAppointment = async (id) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    } catch (error) {
      console.error('deleteAppointment error:', error);
    }
  };

  // ----- NOTIFICATIONS: UPDATE -----
  const markNotificationRead = async (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, unread: false } : n
    );
    setNotifications(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (error) {
      console.error('markNotificationRead error:', error);
    }
  };

  const markAllNotificationsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (error) {
      console.error('markAllNotificationsRead error:', error);
    }
  };

  // ----- NOTIFICATIONS: DELETE -----
  const deleteNotification = async (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (error) {
      console.error('deleteNotification error:', error);
    }
  };

  // ----- PROFILE: UPDATE -----
  const updateProfile = async (changes) => {
    const updated = { ...profile, ...changes };
    setProfile(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      await welfareService.updateProfile(changes).catch(() => {});
    } catch (error) {
      console.error('updateProfile error:', error);
    }
  };

  // ----- SCHEDULE & AVAILABILITY: UPDATE -----
  const updateSchedule = async (changes) => {
    const updated = { ...profile, ...changes };
    setProfile(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      const res = await welfareService.updateSchedule(changes).catch(async () => {
        return await welfareService.updateProfile(changes);
      });
      if (res?.officer) {
        const synced = buildProfileFromAuth(res.officer);
        setProfile(synced);
        await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(synced));
      }
      return res;
    } catch (error) {
      console.error('updateSchedule error:', error);
      throw error;
    }
  };

  // ----- PRIVACY: UPDATE -----
  const updatePrivacy = async (changes) => {
    const updated = { ...privacy, ...changes };
    setPrivacy(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PRIVACY, JSON.stringify(updated));
    } catch (error) {
      console.error('updatePrivacy error:', error);
    }
  };

  // ----- Reset for testing (optional) -----
  const resetWelfareData = async () => {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      setAppointments(initialAppointments);
      setNotifications(initialNotifications);
      setProfile(initialOfficer);
      setPrivacy(initialPrivacy);
    } catch (error) {
      console.error('resetWelfareData error:', error);
    }
  };

  const value = {
    // State
    appointments,
    notifications,
    profile,
    privacy,
    isLoading,

    // Getters (READ)
    getAppointments,
    getAppointmentById,

    // Appointments (UPDATE / DELETE)
    updateAppointment,
    cancelAppointment,
    deleteAppointment,

    // Notifications (UPDATE / DELETE)
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,

    // Profile (UPDATE)
    updateProfile,

    // Schedule & Availability (UPDATE)
    updateSchedule,

    // Privacy (UPDATE)
    updatePrivacy,

    // Utilities
    resetWelfareData
  };

  return <WelfareContext.Provider value={value}>{children}</WelfareContext.Provider>;
};

export const useWelfare = () => {
  const context = useContext(WelfareContext);
  if (!context) {
    throw new Error('useWelfare must be used within a WelfareProvider');
  }
  return context;
};