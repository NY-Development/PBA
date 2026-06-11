import api from '@/src/api/client';

// ==========================================
// TYPES
// ==========================================

export interface CBEVerifyInput {
  reference: string;
  accountSuffix: string;
  order_id: string;
}

export interface TelebirrVerifyInput {
  transactionId: string;
  phoneNumber: string;
  amount: number;
  [key: string]: unknown; // passthrough for additional fields
}

export interface PaymentVerifyResponse {
  success: boolean;
  message?: string;
  amount?: number;
  reference?: string;
  [key: string]: unknown;
}

// ==========================================
// SERVICE
// ==========================================

export const paymentService = {
  /**
   * POST /payment/verify-cbe
   * Verifies a CBE bank transfer using the transaction reference.
   */
  verifyCBE: async (data: CBEVerifyInput): Promise<PaymentVerifyResponse> => {
    const response = await api.post<PaymentVerifyResponse>('payment/verify-cbe', data);
    return response.data;
  },

  /**
   * POST /payment/verify-telebirr
   * Verifies a Telebirr mobile payment. Body is passed through to the external API.
   */
  verifyTelebirr: async (data: TelebirrVerifyInput): Promise<PaymentVerifyResponse> => {
    const response = await api.post<PaymentVerifyResponse>('payment/verify-telebirr', data);
    return response.data;
  },
};
