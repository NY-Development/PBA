import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { products } from "./products.js";

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  quantity: integer("quantity").default(1).notNull(),

  addedAt: timestamp("added_at").defaultNow(),
});