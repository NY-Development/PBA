import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { refreshTokens } from "../schema/refreshTokens.js";
import { users } from "../schema/users.js";


export const seedRefreshTokens = async() => {
  try{
    const allUsers = await db.select().from(users);
    
    const data = Array.from({ length: 50 }, () => {
      const user = faker.helpers.arrayElement(allUsers);
      
      return {
        userId: user.id,
        token: faker.string.alpha(12),
        revoked: faker.datatype.boolean(),
        expiresAt: faker.date.anytime(),
      };
    });
    
    return await db.insert(refreshTokens).values(data).returning();
  }catch (err) {
    logger.error(err.cause || err.message);
  }
};