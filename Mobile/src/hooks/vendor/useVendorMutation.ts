import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { vendorService, VendorRegisterInput, VendorResponse } from '@/src/services/vendor';
import { AxiosError } from 'axios';

type ApiError = AxiosError<{ message?: string }>;

// ==========================================
// VENDOR REGISTRATION
// ==========================================
export const useVendorRegisterMutation = (
  options?: Omit<UseMutationOptions<VendorResponse, ApiError, VendorRegisterInput>, 'mutationFn'>
) => {
  return useMutation({
    ...options,
    mutationFn: vendorService.register,
  });
};
