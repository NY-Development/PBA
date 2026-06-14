import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { addresses } from "../schema/addresses.js";

export const seedAddresses = async(users) => {
  const data = users.map((user) => ({
    userId: user.id,
    label: faker.helpers.arrayElement([
      "work",
      "home",
    ]),
    street: faker.location.streetAddress(),
  }));
  
  await db.delete(addresses);

  return await db.insert(addresses).values(data).returning();
};