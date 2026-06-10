import { z } from 'zod';

export const updateUserProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().optional(),
  phone: z.string().optional(),
});
