import nodemailer from "nodemailer";
import { Env } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: Env.SENDER_EMAIL,
    pass: Env.SENDER_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});
