import { pgTable, uuid, varchar, timestamp, boolean, text } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length:255 }).notNull(),
  content: text("text"),
  
  isRead: boolean("is_read").default(false),
  isArchived: boolean("is_archived").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});