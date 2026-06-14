import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { orders } from "../schema/orders.js";
import { vendors } from "../schema/vendors.js";
import { products } from "../schema/products.js";
import { orderItems } from "../schema/orderItems.js";

export const seedOrderItems = async() => {
  try{
    const allVendors = await db.select().from(vendors);
    const allProducts = await db.select().from(products);
    const allOrders = await db.select().from(orders);
    
    const data = Array.from({ length: 200 }, () => {
      const product = faker.helpers.arrayElement(allProducts);
      const vendor = faker.helpers.arrayElement(allVendors);
      const order = faker.helpers.arrayElement(allOrders);
      
      return {
        orderId: order.id,
        productId: product.id,
        vendorId: vendor.id,
        quantity: faker.number.int({ min: 1, max: 10 }),
        unitPrice: faker.number.int({ min: 400, max: 800 }),
      };
    });
    
    return await db.insert(orderItems).values(data).returning();
  }catch (err) {
    logger.error(err.cause || err.message);
  }
};