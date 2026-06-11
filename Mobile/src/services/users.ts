import api from '@/src/api/client';

// ==========================================
// TYPES
// ==========================================

export interface UserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface PushTokenInput {
  userId: string;
  token: string;
}

// ==========================================
// SERVICE
// ==========================================

export const usersService = {
  /**
   * GET /users/profile
   * Returns the authenticated user's full profile.
   */
  getProfile: async (): Promise<{ success: boolean; data: UserProfileResponse }> => {
    const response = await api.get<{ success: boolean; data: UserProfileResponse }>('users/profile');
    return response.data;
  },

  /**
   * PATCH /users/profile
   * Updates user profile fields. Supports multipart when avatar is included.
   */
  updateProfile: async (data: UpdateProfileInput): Promise<{ message: string; user: UserProfileResponse }> => {
    const hasAvatar = !!data.avatar;

    if (hasAvatar) {
      const formData = new FormData();
      if (data.firstName) formData.append('firstName', data.firstName);
      if (data.lastName) formData.append('lastName', data.lastName);
      if (data.phone) formData.append('phone', data.phone);
      if (data.avatar) {
        formData.append('avatar', {
          uri: data.avatar.uri,
          name: data.avatar.name,
          type: data.avatar.type,
        } as any);
      }

      const response = await api.patch<{ message: string; user: UserProfileResponse }>(
        'users/profile',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    }

    // JSON body when no avatar
    const payload: Record<string, string> = {};
    if (data.firstName) payload.firstName = data.firstName;
    if (data.lastName) payload.lastName = data.lastName;
    if (data.phone) payload.phone = data.phone;

    const response = await api.patch<{ message: string; user: UserProfileResponse }>(
      'users/profile',
      payload
    );
    return response.data;
  },

  /**
   * POST /users/push-token
   * Registers the device's Expo push notification token.
   */
  savePushToken: async (data: PushTokenInput): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('users/push-token', data);
    return response.data;
  },
};
