import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { addresses } from "../schema/addresses.js";
import { users } from "../schema/users.js";
import { orders } from "../schema/orders.js";

export const seedOrders = async() => {
    const allAddresses = await db.select().from(addresses);
    const allUsers = await db.select().from(users);
    
    const data = Array.from({ length: 200 }, () => {
      const address = faker.helpers.arrayElement(allAddresses);
      const user = faker.helpers.arrayElement(allUsers);
    
      return {
        userId: user.id,
        addressId: address.id,
        status: faker.helpers.arrayElement([
          'pending', 
          'cancelled', 
          'preparing',
          'shipped',
          'delivered',
        ]),
        subtotal: faker.number.int({ min: 500, max: 5000, multipleOf: 10 }),
        shippingFee: faker.number.int({ min: 50, max: 700 }),
        total: faker.number.int({ min: 550, max: 5700, multipleOf: 10 }),
        notes: faker.lorem.sentence(2),
      };
    });

  return await db.insert(orders).values(data).returning();
};