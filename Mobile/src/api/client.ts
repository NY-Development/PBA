// src/api/client.ts
import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// Swapped to EXPO_PUBLIC environment naming conventions
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.66.92.210:9000';

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
  baseURL: `${BASE_URL}/${API_VERSION}`,
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
    // Correctly extracting your global token state directly from Zustand
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
    const errorMessage = (error.response?.data as any)?.message || 'Something went wrong';

    // 401 Unauthorized - The Core Token Refresh Queue Mechanism
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue up all other subsequent requests while the first one refreshes the token
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
        // Use standard root axios here to completely bypass the api client instance interceptor loop
        axios
          .post(`${BASE_URL}/${API_VERSION}/auth/refresh`, { refreshToken })
          .then(({ data }) => {
            // Update global state memory with the fresh token pairs
            setTokens(data.accessToken, data.refreshToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            }
            
            // Re-fire all queued requests with the shiny new token
            processQueue(null, data.accessToken);
            resolve(api(originalRequest));
          })
          .catch((refreshError) => {
            // If the refresh token itself is expired or blacklisted, drop auth memory & force log out
            processQueue(refreshError, null);
            logout();
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // Central Switchboard for other standard HTTP Errors
    if (__DEV__) {
      switch (status) {
        case 403:
          console.error('Forbidden: You do not have permissions.');
          break;
        case 404:
          console.error('Resource not found:', error.config?.url);
          break;
        case 500:
          console.error('Internal Server Error. Please try again later.');
          break;
        default:
          console.error(`[API Error] ${status || 'Network'}: ${errorMessage}`);
      }
    }

    return Promise.reject(error);
  }
);

export default api;