import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});