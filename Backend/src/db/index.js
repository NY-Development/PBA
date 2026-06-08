import { drizzle } from "drizzle-orm/neon-http";
import { Env } from "../configs/env.js";



const db = drizzle(Env.DATABASE_URL);