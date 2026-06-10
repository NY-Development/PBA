import { transporter } from "../../configs/email.js";
import { Env } from "../../configs/env.js";

export const sendEmail = async ({ 
  to,
  subject,
  template
}) => {
  try {
    
    const info = await transporter.sendMail({
      from: `"Peanut Store" <${Env.NODE_ENV==="production" ? Env.SENDER_EMAIL : Env.TEST_EMAIL}>`,
      to,
      subject,
      html: template,
    });
    
    console.log(`✨ Verification code sent to ${to}. Message ID: ${info.messageId}`);
    
    return info;
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${to}:`, error);
    throw error;
  }
};