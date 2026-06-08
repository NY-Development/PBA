import { 
  pgTable, 
  uuid, 
  varchar, 
  timestamp, 
  boolean } from "drizzle-orm/pg-core";
  
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  role: varchar("role", { length: 20 }).default("customer").notNull(),
  isActive: boolean("is_active").default(true),

  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),

  phone: varchar("phone", { length: 20 }),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  avatarPublicId: varchar("avatar_public_id", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});