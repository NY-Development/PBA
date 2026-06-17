import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { expoTokens } from "../schema/expoTokens.js";
import { users } from "../schema/users.js";
import { Env } from "../../configs/env.js";


export const seedExpoTokens = async() => {
  try{
    const allUsers = await db.select().from(users);
    
    const data = Array.from({ length: Env.SEED_EXPO_TOKENS }, () => {
      const user = faker.helpers.arrayElement(allUsers);
      
      return {
        userId: user.id,
        token: faker.string.alpha(12),
      };
    });
    
    return await db.insert(expoTokens).values(data).returning();
  }catch (err) {
    logger.error(err.cause || err.message);
  }
};