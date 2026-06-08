import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const otps = pgTable("otps", {
  id: uuid("id").defaultRandom().primaryKey(),

  email: varchar("email", { length: 255 }).notNull(),
  otp: varchar("otp", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),

  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});