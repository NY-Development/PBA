import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

import { vendors } from "./vendors.js";
import { categories } from "./categories.js";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id, { onDelete: "cascade" }),

  categoryId: uuid("category_id").references(() => categories.id),

  name: varchar("name", { length: 255 }).notNull(),

  description: text("description"),

  price: numeric("price", { precision: 10, scale: 2 }).notNull(),

  weightGrams: integer("weight_grams"),

  stock: integer("stock").default(0).notNull(),

  images: text("images").array(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});