import {
  pgTable,
  uuid,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { products } from "./products.js";

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  rating: smallint("rating").notNull(),

  comment: text("comment"),

  createdAt: timestamp("created_at").defaultNow(),
});