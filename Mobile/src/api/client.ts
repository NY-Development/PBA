import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// Sequence: Explicit environment variable -> Safe machine localhost fallback loop
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:9000';
const API_VERSION = 'api/v1';

/**
 * Thread-safe request queue configuration to stop concurrent 401s
 * from flooding the backend during token refresh windows.
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/${API_VERSION}/`,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ==========================================
// 1. REQUEST INTERCEPTOR
// ==========================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Extracting global token state directly from Zustand
    const token = useAuthStore.getState().accessToken;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Benchmark request metrics cleanly
    (config as any).metadata = { startTime: new Date() };

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ==========================================
// 2. RESPONSE INTERCEPTOR
// ==========================================
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const startTime = (response.config as any).metadata?.startTime;
    if (startTime && __DEV__) {
      const duration = new Date().getTime() - startTime.getTime();
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} took ${duration}ms`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // 401 Unauthorized - The Core Token Refresh Queue Mechanism
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, logout, setTokens } = useAuthStore.getState();

      return new Promise((resolve, reject) => {
        axios
          .post(`${BASE_URL}/${API_VERSION}/auth/refresh`, { refreshToken })
          .then(({ data }) => {
            setTokens(data.accessToken, data.refreshToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            }
            
            processQueue(null, data.accessToken);
            resolve(api(originalRequest));
          })
          .catch((refreshError) => {
            processQueue(refreshError, null);
            logout();
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // Deep-Diagnostic Switchboard for Network Errors
    if (__DEV__) {
      console.log('\n============= 🚨 [API NETWORK ERROR DIAGNOSTIC] =============');
      console.log(`📡 Requested URL:   ${error.config?.method?.toUpperCase()} -> ${error.config?.baseURL}${error.config?.url}`);
      console.log(`✉️  Sent Headers:    `, JSON.stringify(error.config?.headers, null, 2));
      
      if (error.response) {
        // Server replied with a formal error status code (4xx, 5xx)
        console.log(`❌ HTTP Status:     ${error.response.status}`);
        console.log(`📦 Response Body:   `, JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // Local hardware could not bridge a connection path to your backend port
        console.log(`⏳ Request Status:  No response received from the host server.`);
        console.log(`💡 Probable Cause: Your phone cannot route data to your computer's local network IP.`);
        console.log(`🛠️  Target Host:    ${error.config?.baseURL}`);
      } else {
        // Structural setup failure
        console.log(`💥 Context Message: ${error.message}`);
      }
      console.log('==============================================================\n');
    }

    return Promise.reject(error);
  }
);

export default api;