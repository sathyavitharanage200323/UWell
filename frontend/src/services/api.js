import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('[UWell API] Base URL configured:', API_BASE_URL);

api.interceptors.request.use(
  async (config) => {
    console.log(`[UWell API Req] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`);
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[UWell API Req Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[UWell API Res] ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[UWell API Res Error] ${error.config?.url}:`, error.message, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
