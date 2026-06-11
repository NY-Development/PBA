// src/hooks/auth/useAuthMutation.ts
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService, AuthResponse, GenericResponse, UserProfile } from '../../services/auth';
import {
  SignInInput,
  SignUpInput,
  RecoveryInput,
  OtpVerifyInput,
} from '../../types/validation/auth.schema';
import { AxiosError } from 'axios';

// Define a common error type for API errors matching your backend structure
type ApiError = AxiosError<{ message?: string; errors?: Record<string, string[]> }>;

// ==========================================
// LOGIN
// ==========================================
export const useLoginMutation = (
  options?: Omit<UseMutationOptions<AuthResponse, ApiError, SignInInput>, 'mutationFn'>
) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    ...options,
    mutationFn: authService.login,
    onSuccess: (...args) => {
      const [data] = args;
      setAuth(data.user, data.accessToken, data.refreshToken);

      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

// ==========================================
// REGISTER
// ==========================================
export const useSignUpMutation = (
  options?: Omit<UseMutationOptions<AuthResponse, ApiError, SignUpInput>, 'mutationFn'>
) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    ...options,
    mutationFn: authService.register,
    onSuccess: (...args) => {
      const [data] = args;
      setAuth(data.user, data.accessToken, data.refreshToken);

      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

// ==========================================
// LOGOUT
// ==========================================
export const useLogoutMutation = (
  options?: Omit<UseMutationOptions<GenericResponse, ApiError, void>, 'mutationFn'>
) => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    ...options,
    mutationFn: authService.logout,
    onSuccess: (...args) => {
      logout();
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

// ==========================================
// GET ME (Current User Profile)
// ==========================================
export const useMeQuery = (
  options?: Omit<UseQueryOptions<{ authenticated: boolean; user: UserProfile }, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.getMe,
    ...options,
  });
};

// ==========================================
// UPDATE PROFILE
// ==========================================
export const useUpdateProfileMutation = (
  options?: Omit<UseMutationOptions<{ message: string; user: UserProfile }, ApiError, { firstName?: string; lastName?: string; avatar_url?: string }>, 'mutationFn'>
) => {
  return useMutation({
    ...options,
    mutationFn: authService.updateProfile,
  });
};

// ==========================================
// PASSWORD RECOVERY (send code)
// ==========================================
export const useRecoveryMutation = (
  options?: Omit<UseMutationOptions<GenericResponse, ApiError, RecoveryInput>, 'mutationFn'>
) => {
  return useMutation({
    ...options,
    mutationFn: authService.sendRecoveryCode,
  });
};

// ==========================================
// OTP VERIFICATION
// ==========================================
export const useOtpVerifyMutation = (
  options?: Omit<
    UseMutationOptions<GenericResponse, ApiError, OtpVerifyInput & { identity: string }>,
    'mutationFn'
  >
) => {
  return useMutation({
    ...options,
    mutationFn: authService.verifyEmailOtp,
  });
};

// ==========================================
// RESET PASSWORD (after OTP verified)
// ==========================================
export const useResetPasswordMutation = (
  options?: Omit<UseMutationOptions<GenericResponse, ApiError, { email: string; otp: string; password: string }>, 'mutationFn'>
) => {
  return useMutation({
    ...options,
    mutationFn: authService.resetPassword,
  });
};

// ==========================================
// RESEND OTP
// ==========================================
export const useResendOtpMutation = (
  options?: Omit<UseMutationOptions<GenericResponse, ApiError, { email: string; type: 'register' | 'reset' }>, 'mutationFn'>
) => {
  return useMutation({
    ...options,
    mutationFn: authService.resendOtp,
  });
};