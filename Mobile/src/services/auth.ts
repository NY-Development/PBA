import api from '../api/client';
import {
  SignInInput,
  SignUpInput,
  RecoveryInput,
  OtpVerifyInput,
} from '../types/validation/auth.schema';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

export const authService = {
  // ==========================================
  // AUTH ENDPOINTS
  // ==========================================

  login: async (data: SignInInput): Promise<AuthResponse> => {
    const payload = {
      email: data.identity,
      password: data.password,
    };
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  register: async (data: SignUpInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<GenericResponse> => {
    const response = await api.post<GenericResponse>('/auth/logout');
    return response.data;
  },

  // ==========================================
  // USER PROFILE ENDPOINTS
  // ==========================================

  getMe: async (): Promise<{ authenticated: boolean; user: UserProfile }> => {
    const response = await api.get<{ authenticated: boolean; user: UserProfile }>('/auth/me');
    return response.data;
  },

  updateProfile: async (data: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  }): Promise<{ message: string; user: UserProfile }> => {
    const response = await api.patch<{ message: string; user: UserProfile }>('/auth/update', data);
    return response.data;
  },

  updateProfilePicture: async (formData: FormData): Promise<{ message: string; updatedUser: UserProfile }> => {
    const response = await api.post<{ message: string; updatedUser: UserProfile }>(
      '/auth/profile-picture',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  // ==========================================
  // PASSWORD RECOVERY ENDPOINTS
  // ==========================================

  sendRecoveryCode: async (data: RecoveryInput): Promise<GenericResponse> => {
    const payload = { email: data.identity };
    const response = await api.post<GenericResponse>('/auth/forgot-password', payload);
    return response.data;
  },

  verifyEmailOtp: async (
    data: OtpVerifyInput & { identity: string }
  ): Promise<GenericResponse> => {
    const payload = { email: data.identity, otp: data.code };
    const response = await api.post<GenericResponse>('/auth/verify-email', payload);
    return response.data;
  },

  resetPassword: async (data: {
    email: string;
    otp: string;
    password: string;
  }): Promise<GenericResponse> => {
    const response = await api.post<GenericResponse>('/auth/reset-password', data);
    return response.data;
  },

  resendOtp: async (data: {
    email: string;
    type: 'register' | 'reset';
  }): Promise<GenericResponse> => {
    const response = await api.post<GenericResponse>('/auth/resend-otp', data);
    return response.data;
  },
};
