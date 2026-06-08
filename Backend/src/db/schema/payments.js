import {
  pgTable,
  uuid,
  varchar,
  numeric,
  text,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { orders } from "./orders.js";
import { vendors } from "./vendors.js";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),

  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

  paymentMethod: varchar("payment_method", { length: 50 }),

  transactionReference: varchar("transaction_reference", { length: 255 }),

  description: text("description"),

  paymentDate: date("payment_date").notNull(),

  proofImageUrl: text("proof_image_url"),
  proofPublicId: text("proof_public_id"),

  status: varchar("status", { length: 20 }).default("pending"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});