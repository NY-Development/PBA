import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { otps } from "../schema/otps.js";
import { users } from "../schema/users.js";


export const seedOTPs = async() => {
  try{
    const allUsers = await db.select().from(users);
    
    const data = Array.from({ length: 50 }, () => {
      const user = faker.helpers.arrayElement(allUsers);
      
      return {
        email: user.email,
        otp: faker.string.numeric(6),
        type: faker.helpers.arrayElement([
          'reset', 'registration'
        ]),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        expiresAt: faker.date.anytime(),
      };
    });
    
    return await db.insert(otps).values(data).returning();
  }catch (err) {
    logger.error(err.cause || err.message);
  }
};