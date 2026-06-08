import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  label: varchar("label", { length: 50 }),

  street: text("street").notNull(),
});