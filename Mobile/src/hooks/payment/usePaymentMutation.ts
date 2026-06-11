import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { paymentService, CBEVerifyInput, TelebirrVerifyInput, PaymentVerifyResponse } from '@/src/services/payment';
import { AxiosError } from 'axios';

type ApiError = AxiosError<{ message?: string }>;

// ==========================================
// VERIFY CBE
// ==========================================
export const useVerifyCBEMutation = (
  options?: Omit<UseMutationOptions<PaymentVerifyResponse, ApiError, CBEVerifyInput>, 'mutationFn'>
) => {
  return useMutation({
    ...options,
    mutationFn: paymentService.verifyCBE,
  });
};

// ==========================================
// VERIFY TELEBIRR
// ==========================================
export const useVerifyTelebirrMutation = (
  options?: Omit<UseMutationOptions<PaymentVerifyResponse, ApiError, TelebirrVerifyInput>, 'mutationFn'>
) => {
  return useMutation({
    ...options,
    mutationFn: paymentService.verifyTelebirr,
  });
};
