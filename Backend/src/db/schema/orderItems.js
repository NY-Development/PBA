import {
  pgTable,
  uuid,
  integer,
  numeric,
} from "drizzle-orm/pg-core";

import { orders } from "./orders.js";
import { products } from "./products.js";
import { vendors } from "./vendors.js";

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),

  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id),

  quantity: integer("quantity").notNull(),

  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});