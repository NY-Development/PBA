import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

export const Env = {
  DATABASE_URL,
  PORT,
  NODE_ENV
}