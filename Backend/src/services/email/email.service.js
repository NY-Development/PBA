import { transporter } from "../../configs/email.js";
import { verificationEmailTemplate } from "../../templates/email.template.js";
import { Env } from "../../configs/env.js";

export const sendVerificationEmail = async ({ to, otp }) => {
  try {
    
    const info = await transporter.sendMail({
      from: `"Peanut Store" <${Env.SENDER_EMAIL}>`,
      to,
      subject: `Your verification code is ${otp}`,
      html: verificationEmailTemplate(otp),
    });
    
    console.log(`✨ Verification code sent to ${to}. Message ID: ${info.messageId}`);
    
    return info;
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${to}:`, error);
    throw error;
  }
};