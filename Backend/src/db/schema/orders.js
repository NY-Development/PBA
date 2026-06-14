import {
  pgTable,
  uuid,
  varchar,
  numeric,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { addresses } from "./addresses.js";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  addressId: uuid("address_id").references(() => addresses.id),

  status: varchar("status", { length: 30 }).default("pending"),

  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 }).default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});