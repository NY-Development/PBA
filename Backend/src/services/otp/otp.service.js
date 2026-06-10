import { eq, and, gt } from "drizzle-orm";
import crypto from "crypto";

import { db } from "../../db/index.js";
import { otps } from "../../db/schema/otps.js";

// GENERATE 6-DIGIT OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// CREATE OTP
const createOTP = async ({
  email,
  otp,
  type,
}) => {

  const result = await db
    .insert(otps)
    .values({
      email,
      otp,
      type,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    })
    .returning();

  return result[0];
};

// FIND OTP
const findOTP = async ({
  email,
  type,
}) => {

  const result = await db
    .select()
    .from(otps)
    .where(
      and(
        eq(otps.email, email),
        eq(otps.type, type),
        gt(otps.expiresAt, new Date())
      )
    )
    .limit(1);

  return result[0] || null;
};

// DELETE OTP
const deleteOTP = async ({
  email,
  type,
}) => {

  const result = await db
    .delete(otps)
    .where(
      and(
        eq(otps.email, email),
        eq(otps.type, type)
      )
    )
    .returning();

  return result;
};

export const OTPRepository = {
  createOTP,
  findOTP,
  deleteOTP,
};