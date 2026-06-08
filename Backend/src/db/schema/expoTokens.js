import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const expoTokens = pgTable("expo_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  token: text("token").notNull().unique(),
});