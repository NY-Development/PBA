import { z } from 'zod';

// ==========================================
// Vendor Registration Schema
// ==========================================
export const vendorRegisterSchema = z.object({
  store_name: z
    .string()
    .min(2, 'Store name must be at least 2 characters')
    .max(100, 'Store name is too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description is too long'),
  payout_email: z
    .string()
    .email('Please enter a valid payout email'),
  tin_number: z
    .string()
    .min(8, 'TIN number must be at least 8 digits')
    .max(15, 'TIN number is too long')
    .regex(/^\d+$/, 'TIN number must only contain digits'),
  // File fields are usually handled as uris in the form state
  logo: z.any().optional(),
  banner: z.any().optional(),
  license: z.any().optional(),
});

export type VendorRegisterInput = z.infer<typeof vendorRegisterSchema>;
