import { sql } from '../../configs/db.js';
import crypto from "crypto";

// generate 6-digit OTP
export const generateOTP = () => {
  return crypto
    .randomInt(100000, 999999)
    .toString();
};

// save OTP
const createOTP = async ({
  email,
  otp,
  type
}) => {
  await sql`
    INSERT INTO otps (
      email,
      otp,
      type,
      expires_at
    )
    VALUES (
      ${email},
      ${otp},
      ${type},
      NOW() + INTERVAL '10min'
    )
  `;
};

// find latest valid OTP
const findOTP = async ({
  email,
  type,
}) => {
  const result = await sql`
    SELECT *
    FROM otps
    WHERE email = ${email}
    AND type = ${type}
    AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return result[0];
};

// delete OTP
const deleteOTP = async ({
  email,
  type,
}) => {
  await sql`
    DELETE FROM otps
    WHERE email = ${email}
    AND type = ${type}
  `;
};

export const OTPRepository = {
  createOTP,
  findOTP,
  deleteOTP,
};