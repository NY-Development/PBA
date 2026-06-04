import crypto from "crypto";

export const createOTP = () => {
  return crypto
    .randomInt(100000, 999999)
    .toString();
};