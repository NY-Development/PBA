import nodemailer from "nodemailer";
import { Env } from "./env.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: Env.EMAIL_USER,
    pass: Env.EMAIL_PASS,
  },
});