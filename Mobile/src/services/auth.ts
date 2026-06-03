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

  sendRecoveryCode: async (data: RecoveryInput): Promise<GenericResponse> => {
    const response = await api.post<GenericResponse>('/auth/recovery/send', data);
    return response.data;
  },

  verifyOtpCode: async (
    data: OtpVerifyInput & { identity: string }
  ): Promise<GenericResponse> => {
    const response = await api.post<GenericResponse>('/auth/recovery/verify', data);
    return response.data;
  },
};
