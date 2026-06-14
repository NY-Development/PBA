import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { categories } from "../schema/categories.js";
import { vendors } from "../schema/vendors.js";
import { products } from "../schema/products.js";

export const seedProducts = async() => {
  try{
    const allCategories = await db.select().from(categories);
    const allVendors = await db.select().from(vendors);
    
    const data = Array.from({ length: 200 }, () => {
      const category = faker.helpers.arrayElement(allCategories);
      const vendor = faker.helpers.arrayElement(allVendors);
      
      return {
        vendorId: vendor.id,
        categoryId: category.id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        weightGrams: faker.helpers.arrayElement([500, 1000, null]),
        stock: faker.number.int({ min: 1, max: 100 }),
        images: [faker.image.urlPicsumPhotos({ height: 1000, width: 1000 })],
      };
      
    });
    
    return await db.insert(products).values(data).returning();
  }catch (err) {
    logger.error(err.cause || err.message);
  }
};