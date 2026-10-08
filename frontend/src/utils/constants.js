export const USER_ROLES = {
  STUDENT: 'student',
  COUNSELOR: 'counselor',
  WELFARE: 'welfare',
  MANAGEMENT: 'management'
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

export const MOOD_LEVELS = {
  EXCELLENT: 5,
  GOOD: 4,
  FAIR: 3,
  POOR: 2,
  TERRIBLE: 1
};

export const SESSION_TYPES = {
  INDIVIDUAL: 'individual',
  GROUP: 'group',
  EMERGENCY: 'emergency'
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.uwell.example.com/v1';
