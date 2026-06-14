import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { users } from "../schema/users.js";
import { cartItems } from "../schema/cartItems.js";
import { products } from "../schema/products.js";

export const seedCartItems = async() => {
  try{
    const allUsers = await db.select().from(users);
    const allProducts = await db.select().from(products);
    
    const data = Array.from({ length: 200 }, () => {
      const product = faker.helpers.arrayElement(allProducts);
      const user = faker.helpers.arrayElement(allUsers);
      
      return {
        quantity: faker.number.int({ min: 1, max: 20 }),
        productId: product.id,
        userId: user.id,
      };
    });
    
    return await db.insert(cartItems).values(data).returning();
  }catch (err) {
    logger.error(err.cause || err.message);
  }
};