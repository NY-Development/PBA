import { neon } from "@neondatabase/serverless";
import { Env } from "./env.js";

export const sql = neon(Env.DATABASE_URL)
export const testDBConnection = async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connected ');
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    return false;
  }
};