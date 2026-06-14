import { faker } from "@faker-js/faker";
import { db } from "../index.js";
import { orders } from "../schema/orders.js";
import { vendors } from "../schema/vendors.js";
import { users } from "../schema/users.js";
import { payments } from "../schema/payments.js";


export const seedPayments = async() => {
  const allVendors = await db.select().from(vendors);
  const allUsers = await db.select().from(users);
  const allOrders = await db.select().from(orders);
  
  const data = Array.from({ length: 200 }, () => {
    const user = faker.helpers.arrayElement(allUsers);
    const vendor = faker.helpers.arrayElement(allVendors);
    const order = faker.helpers.arrayElement(allOrders);
    
    return {
      userId: user.id,
      orderId: order.id,
      vendorId: vendor.id,
      amount: faker.number.int({ min: 1, max: 10 }),
      paymentMethod: faker.helpers.arrayElement([
        "CBE", "Telebirr"
      ]),
      transactionReference: faker.string.alphanumeric({ 
        casing: 'upper',
        length: 10
      }),
      description: faker.lorem.sentence(2),
      paymentDate: faker.date.anytime(),
      proofImageUrl: faker.image.url(),
      proofPublicId: faker.string.uuid(),
      status: faker.helpers.arrayElement([
        "pending", "paid", "cancelled"
      ]),
    };
  });
  
  return await db.insert(payments).values(data).returning();
};