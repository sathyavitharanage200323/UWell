import { Platform } from 'react-native';

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

import Constants from 'expo-constants';

// ── Dynamic API Base URL ──────────────────────────────────────────────────
// Automatically determines the correct IP address:
// 1. EXPO_PUBLIC_API_URL env variable if provided.
// 2. Dynamic host IP from Expo Go (Constants.expoConfig?.hostUri) so physical phones
//    always connect to the host computer's current Wi-Fi IP automatically.
// 3. Fallback to 192.168.1.12:8082 (port 8082 is allowed by Windows Firewall rule 8081-8112).
const resolveApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Detect IP from Expo Go Metro connection
  const hostUri =
    Constants?.expoConfig?.hostUri ||
    Constants?.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants?.manifest?.debuggerHost;

  const detectedIp = hostUri ? hostUri.split(':')[0] : null;

  if (Platform.OS === 'web') {
    return 'http://localhost:8082/api';
  }

  const targetIp = detectedIp || '192.168.1.12';
  return `http://${targetIp}:8082/api`;
};

export const API_BASE_URL = resolveApiBaseUrl();



