import { z } from 'zod';

// Flexible Ethiopian phone validation: allows +251, 0, or just 9/7 prefix followed by 8 digits
const ethiopianPhoneRegex = /^(?:\+251|0)?[79]\d{8}$/;

// Strict Ethiopian phone structural validation: exactly +251 followed by 7 or 9 and 8 digits
const ethiopianPhoneWithPrefixRegex = /^\+251[79]\d{8}$/;

// Password validation: min 8 chars, at least one number and one special character
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

export const signInSchema = z.object({
  identity: z.string().refine(
    (val) => {
      const isEmail = z.string().email().safeParse(val).success;
      const isPhone = ethiopianPhoneRegex.test(val);
      return isEmail || isPhone;
    },
    {
      message: 'Must be a valid email or Ethiopian phone number starting with 9 or 7',
    }
  ),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
  phone: z
    .string()
    .regex(
      ethiopianPhoneWithPrefixRegex,
      'Must be a valid Ethiopian phone number starting with +251'
    ),
  email: z.string().email('Must be a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      passwordRegex,
      'Password must contain at least one number and one special character'
    ),
  role: z.enum(['buyer', 'maker']),
  agreeTerms: z.literal(true, {
    message: 'You must agree to the terms and conditions',
  }),
});

export const recoverySchema = z.object({
  identity: z.string().refine(
    (val) => {
      const isEmail = z.string().email().safeParse(val).success;
      const isPhone = ethiopianPhoneRegex.test(val);
      return isEmail || isPhone;
    },
    {
      message: 'Must be a valid email or Ethiopian phone number',
    }
  ),
});

export const otpVerifySchema = z.object({
  code: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

// Export inferred TypeScript types
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type RecoveryInput = z.infer<typeof recoverySchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
