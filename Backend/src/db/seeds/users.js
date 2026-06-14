import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { users } from "../schema/users.js";

export const seedUsers = async() => {
  try{
    const data = Array.from({ length: 100 }, () => ({
      email: faker.internet.email().toLowerCase(),
      password: "$2b$10$abcdefghijklmnopqrstuv",
      role: faker.helpers.arrayElement([
        "customer",
        "vendor",
        "admin",
      ]),
      isActive: faker.datatype.boolean(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      avatarUrl: faker.image.avatar(),
      avatarPublicId: faker.string.uuid(),
    }));
    
    return await db.insert(users).values(data).returning();
  }catch (err) {
    logger.error(err.cause || err.message);
  }
};