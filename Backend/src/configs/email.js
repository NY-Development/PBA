import nodemailer from "nodemailer";
import { Env } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: Env.SMTP_USER,
    pass: Env.SMTP_PASS,
  }
});