import bcrypt from "bcryptjs";
import { Env } from "../configs/env.js"

if(!Env.SALT_ROUNDS){
  throw new Error("Hash Error: missing salt from .env")
};

// PASSWORD HASH AND VERIFICATION 
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, Env.SALT_ROUNDS);
  
  return hashedPassword;
}

const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  
  return isMatch;
}

// REFRESH TOKEN  AND VERIFICATION
const hashToken = async (token) => {
  const hashedToken = await bcrypt.hash(token, Env.SALT_ROUNDS);
  
  return hashedToken;
}

const compareToken = async (token, hashedToken) => {
  const isMatch = await bcrypt.compare(token, hashedToken)
  
  return isMatch;
}

// OTP HASH AND VERIFICATION
const hashOTP = async (otp) => {
  const hashed = await bcrypt.hash(otp, Env.SALT_ROUNDS);
  
  return hashed;
}

const compareOTP = async (otp, hashedOTP) => {
  const isMatch = await bcrypt.compare(otp, hashedOTP)
  
  return isMatch;
}


export const HashUtils = {
  hashPassword,
  hashToken,
  comparePassword,
  compareToken,
  hashOTP,
  compareOTP
}