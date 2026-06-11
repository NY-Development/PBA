import { ExtractedPaymentData } from '@/src/types/validation/checkout.schema';

// ==========================================
// SYSTEM PROMPT
// ==========================================

const PAYMENT_EXTRACTION_PROMPT = `You are a highly precise Ethiopian Payment Receipt Data Extraction Engine.
Your goal is to parse raw OCR text from Ethiopian bank/mobile payment receipts and return a strict JSON object.

RULES:
1. RESPONSE FORMAT: Return ONLY a raw JSON object. NO markdown code blocks, NO backticks, NO explanations, NO conversational text.
2. MISSING DATA: If a field cannot be found, use null for strings and null for numbers.
3. NUMERIC DATA: Ensure all amounts are strictly numbers (e.g., 250.50, not "250.50").
4. STRUCTURE: Follow this schema exactly:
{
  "reference": "string or null — the transaction reference/receipt number",
  "accountSuffix": "string or null — last 4-6 digits of the payer bank account",
  "amount": 0.0,
  "date": "string or null — transaction date in YYYY-MM-DD format if possible",
  "payerName": "string or null — name of the person who made the payment",
  "transactionId": "string or null — unique transaction ID (especially for Telebirr)",
  "phoneNumber": "string or null — phone number used for mobile payment (Telebirr)"
}

CONTEXT:
- CBE (Commercial Bank of Ethiopia) receipts typically have: Reference/Receipt No, Account suffix, Amount, Date, Name
- Telebirr receipts typically have: Transaction ID, Phone Number, Amount, Date
- Ethiopian currency is ETB (Ethiopian Birr). Parse amounts accordingly.
- Dates may appear as DD/MM/YYYY, MM/DD/YYYY, or Ethiopian calendar. Convert to YYYY-MM-DD Gregorian if possible.`;

// ==========================================
// EXTRACTION SERVICE
// ==========================================

/**
 * Sends raw OCR text to OpenRouter AI for structured payment data extraction.
 * Follows the ai_extraction_template.md pattern.
 */
export const extractPaymentData = async (
  rawOcrText: string,
  paymentMethod: 'cbe' | 'telebirr'
): Promise<ExtractedPaymentData> => {
  const apiKey = process.env.EXPO_PUBLIC_OPEN_ROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('EXPO_PUBLIC_OPEN_ROUTER_API_KEY is not set. Run: npx expo start -c');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-nemo',
      messages: [
        { role: 'system', content: PAYMENT_EXTRACTION_PROMPT },
        {
          role: 'user',
          content: `PAYMENT METHOD: ${paymentMethod.toUpperCase()}\n\nPROCESS THIS RECEIPT TEXT:\n${rawOcrText}`,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API Error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('AI returned empty response');
  }

  // Double-parse safety: handle both stringified and pre-parsed objects
  let parsed: unknown;
  try {
    const decoded = JSON.parse(content);
    parsed = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }

  return parsed as ExtractedPaymentData;
};
