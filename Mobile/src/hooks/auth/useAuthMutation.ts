// src/hooks/auth/useAuthMutation.ts
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService, AuthResponse, GenericResponse } from '../../services/auth';
import {
  SignInInput,
  SignUpInput,
  RecoveryInput,
  OtpVerifyInput,
} from '../../types/validation/auth.schema';
import { AxiosError } from 'axios';

// Define a common error type for API errors matching your backend structure
type ApiError = AxiosError<{ message?: string; errors?: Record<string, string[]> }>;

export const useLoginMutation = (
  options?: Omit<UseMutationOptions<AuthResponse, ApiError, SignInInput>, 'mutationFn'>
) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    ...options, // Spread first so explicit structural methods below take precedence
    mutationFn: authService.login,
    onSuccess: (...args) => {
      const [data] = args;
      // Trigger layout state gateways and update Zustand store
      setAuth(data.user, data.accessToken, data.refreshToken);

      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

export const useSignUpMutation = (
  options?: Omit<UseMutationOptions<AuthResponse, ApiError, SignUpInput>, 'mutationFn'>
) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    ...options, // Spread first to prevent custom component hooks from erasing global state saving
    mutationFn: authService.register,
    onSuccess: (...args) => {
      const [data] = args;
      // Cleanly store registration tokens and update cache context
      setAuth(data.user, data.accessToken, data.refreshToken);

      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

export const useRecoveryMutation = (
  options?: Omit<UseMutationOptions<GenericResponse, ApiError, RecoveryInput>, 'mutationFn'>
) => {
  return useMutation({
    ...options,
    mutationFn: authService.sendRecoveryCode,
  });
};

export const useOtpVerifyMutation = (
  options?: Omit<
    UseMutationOptions<GenericResponse, ApiError, OtpVerifyInput & { identity: string }>,
    'mutationFn'
  >
) => {
  return useMutation({
    ...options,
    mutationFn: authService.verifyOtpCode,
  });
};