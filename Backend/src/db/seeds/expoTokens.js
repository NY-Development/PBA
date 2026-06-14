import { faker } from "@faker-js/faker";
import { db } from "../index.js";
import { expoTokens } from "../schema/expoTokens.js";
import { users } from "../schema/users.js";


export const seedExpoTokens = async() => {
  const allUsers = await db.select().from(users);
  
  const data = Array.from({ length: 50 }, () => {
    const user = faker.helpers.arrayElement(allUsers);
    
    return {
      userId: user.id,
      token: faker.string.alpha(12),
    };
  });
  
  return await db.insert(expoTokens).values(data).returning();
};