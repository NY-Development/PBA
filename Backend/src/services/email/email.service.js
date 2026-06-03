import { transporter } from "../../src/configs/email.js";
import { verificationEmailTemplate } from "../../templates/email.template.js";
import { Env } from "../../configs/env.js"

export const sendVerificationEmail = async ({
  to,
  otp,
}) => {
  await transporter.sendMail({
    from: Env.EMAIL_USER,
    to,
    subject: "Verify your email",
    html: verificationEmailTemplate(otp),
  });
};