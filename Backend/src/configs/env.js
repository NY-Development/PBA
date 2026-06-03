import dotenv from "dotenv";

dotenv.config();

// DB
const DATABASE_URL = process.env.DATABASE_URL;

// REDIS URL
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6380";

// ACCESS TOKEN AND COOKIE
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const ACCESS_COOKIE_MAX_AGE = process.env.ACCESS_COOKIE_MAX_AGE;

// REFRESH TOKEN AND COOKIE
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
const REFRESH_COOKIE_MAX_AGE = process.env.REFRESH_COOKIE_MAX_AGE;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// HASH SALT
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 12;

// SERVER OPTIONS
const PORT = Number(process.env.PORT) || 9000;
const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const SERVER_ORIGIN = process.env.SERVER_ORIGIN;



export const Env = {
  DATABASE_URL,
  REDIS_URL,
  
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  ACCESS_COOKIE_MAX_AGE,
  
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_COOKIE_MAX_AGE,
  
  SALT_ROUNDS,
  
  PORT,
  NODE_ENV,
  CLIENT_ORIGIN,
  SERVER_ORIGIN
}