import nodemailer from "nodemailer";
import { Env } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: Env.NODE_ENV==="production" 
    ? "smtp-relay.brevo.com"
    : "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: Env.NODE_ENV==="production"
      ? Env.SMTP_USER
      : Env.TEST_USER,
    pass: Env.NODE_ENV==="production"
      ? Env.SMTP_PASS
      : Env.TEST_PASS,
  }
});