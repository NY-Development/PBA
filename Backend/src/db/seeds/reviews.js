import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { reviews } from "../schema/reviews.js";
import { users } from "../schema/users.js";
import { products } from "../schema/products.js";


export const seedReviews = async() => {
  try{
    const allUsers = await db.select().from(users);
    const allProducts = await db.select().from(products);
    
    const data = Array.from({ length: 50 }, () => {
      const user = faker.helpers.arrayElement(allUsers);
      const product = faker.helpers.arrayElement(allProducts);
      
      return {
        userId: user.id,
        productId: product.id,
        rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        comment: faker.lorem.sentence(3),
      };
    });
    
    return await db.insert(reviews).values(data).returning();
  }catch (err) {
    logger.error(err.cause || err.message);
  }
};