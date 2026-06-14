import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { vendors } from "../schema/vendors.js";
import { users } from "../schema/users.js";

export const seedVendors = async () => {
  const allUsers = await db.select().from(users);

  const data = allUsers.map((user) => ({
    userId: user.id,
    storeName: faker.company.name(),
    description: faker.company.catchPhrase(),
    logoUrl: faker.image.url(),
    bannerUrl: faker.image.url(),
    status: faker.helpers.arrayElement([
      "pending",
      "active",
      "inactive",
      "suspended",
      "rejected",
    ]),
    tinNumber: faker.string.numeric(10),
    logoPublicId: faker.string.uuid(),
    bannerPublicId: faker.string.uuid(),
  }));

  return await db.insert(vendors).values(data).returning();
};