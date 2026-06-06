import { neon } from "@neondatabase/serverless";
import { Env } from "./env.js";
import logger from "../utils/logger.js";

export const sql = neon(Env.DATABASE_URL)

export const testDBConnection = async () => {
  try {
    const result = await sql`SELECT NOW()`;
    logger.info('✅ Database connected ');
    return true;
  } catch (err) {
    logger.error('❌ Database connection failed:', err);
    return false;
  }
};