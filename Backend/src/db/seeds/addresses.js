import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { Env } from "../../configs/env.js";
import { db } from "../index.js";
import { addresses } from "../schema/addresses.js";
import { users } from "../schema/users.js";

export const seedAddresses = async() => {
  try{
    const allUsers = await db.select().from(users);
    
    const data = Array.from({ length: Env.SEED_ADDRESSES }, () => {
      const user = faker.helpers.arrayElement(allUsers);
      
      return {
        userId: user.id,
        label: faker.helpers.arrayElement([
          "work",
          "home",
        ]),
        street: faker.location.streetAddress(),
      };
    });
  
    return await db.insert(addresses).values(data).returning();

  }catch (err) {
    logger.error(err.cause || err.message);
  }
};