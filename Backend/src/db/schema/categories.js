import {
  pgTable,
  uuid,
  varchar,
  timestamp
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});