import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { products } from "../schema/products.js";

export const seedProducts = async(vendors) => {
  const data = vendors.map((vendor) => ({
    vendorId: user.id,
    storeName: faker.company.name(),
    description: faker.company.catchPhrase(),
    logoUrl: faker.image.url(),
    bannerUrl: faker.image.url(),
    status: faker.helpers.arrayElement(['pending', 'active', 'inactive', 'suspended', 'rejected']),
    tinNumber: faker.string.numeric(10),
    logoPublicId: faker.string.uuid(),
    bannerPublicId: faker.string.uuid(),
  }));
  
  await db.delete(products);

  return await db.insert(products).values(data).returning();
};