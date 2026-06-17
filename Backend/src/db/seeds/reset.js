import { sql } from "drizzle-orm";
import { db } from "../index.js";

export const resetDatabase = async () => {
  await db.execute(sql`
    TRUNCATE TABLE
      cart_items,
      order_items,
      payments,
      orders,
      reviews,
      notifications,
      addresses,
      products,
      vendors,
      expo_tokens,
      refresh_tokens,
      otps,
      users,
      categories
    RESTART IDENTITY CASCADE;
  `);
};