import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { usersService, UserProfileResponse, UpdateProfileInput, PushTokenInput } from '@/src/services/users';
import { AxiosError } from 'axios';

type ApiError = AxiosError<{ message?: string }>;

// ==========================================
// GET PROFILE
// ==========================================
export const useProfileQuery = (
  options?: Omit<UseQueryOptions<{ success: boolean; data: UserProfileResponse }, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['users', 'profile'],
    queryFn: usersService.getProfile,
    ...options,
  });
};

// ==========================================
// UPDATE PROFILE
// ==========================================
export const useUpdateProfileMutation = (
  options?: Omit<UseMutationOptions<{ message: string; user: UserProfileResponse }, ApiError, UpdateProfileInput>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: usersService.updateProfile,
    onSuccess: (...args) => {
      // Invalidate the cached profile so it re-fetches
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
      options?.onSuccess?.(...args);
    },
  });
};

// ==========================================
// SAVE PUSH TOKEN
// ==========================================
export const useSavePushTokenMutation = (
  options?: Omit<UseMutationOptions<{ message: string }, ApiError, PushTokenInput>, 'mutationFn'>
) => {
  return useMutation({
    ...options,
    mutationFn: usersService.savePushToken,
  });
};
