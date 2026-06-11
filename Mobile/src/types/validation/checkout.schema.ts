import { z } from 'zod';

// ==========================================
// CBE Payment Verification Schema
// ==========================================
export const cbePaymentSchema = z.object({
  reference: z
    .string()
    .min(1, 'Transaction reference is required')
    .describe('CBE transaction reference number'),
  accountSuffix: z
    .string()
    .min(1, 'Account suffix is required')
    .describe('Last 4-6 digits of the payer CBE account'),
  order_id: z
    .string()
    .min(1, 'Order ID is required'),
});

export type CBEPaymentInput = z.infer<typeof cbePaymentSchema>;

// ==========================================
// Telebirr Payment Verification Schema
// ==========================================
export const telebirrPaymentSchema = z.object({
  transactionId: z
    .string()
    .min(1, 'Transaction ID is required')
    .describe('Telebirr transaction ID'),
  phoneNumber: z
    .string()
    .min(10, 'Valid phone number is required')
    .describe('Telebirr phone number used for payment'),
  amount: z
    .number()
    .positive('Amount must be positive')
    .describe('Payment amount in ETB'),
});

export type TelebirrPaymentInput = z.infer<typeof telebirrPaymentSchema>;

// ==========================================
// AI-Extracted Payment Data Schema
// ==========================================
export const extractedPaymentSchema = z.object({
  reference: z.string().nullable().default(null),
  accountSuffix: z.string().nullable().default(null),
  amount: z.number().nullable().default(null),
  date: z.string().nullable().default(null),
  payerName: z.string().nullable().default(null),
  transactionId: z.string().nullable().default(null),
  phoneNumber: z.string().nullable().default(null),
});

export type ExtractedPaymentData = z.infer<typeof extractedPaymentSchema>;
