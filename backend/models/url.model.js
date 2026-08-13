import { timestamp, uuid, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const urlsTable = pgTable("urls", {
    id: uuid("id").primaryKey().defaultRandom(),
    
    userId: uuid("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    
    shortCode: varchar("code", { length: 155 }).notNull().unique(),
    targetURL: text("target_url").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const urlAnalyticsTable = pgTable("url_analytics", {
    id: uuid("id").primaryKey().defaultRandom(),

    urlId: uuid("url_id")
        .notNull()
        .references(() => urlsTable.id, { onDelete: "cascade" }),

    ipAddress: varchar("ip_address", { length: 45 }),  
    region: varchar("region", { length: 100 }),
    country: varchar("country", { length: 100 }),
    city: varchar("city", { length: 100 }),

    deviceType: varchar("device_type", { length: 50 }),
    browser: varchar("browser", { length: 100 }),

    userAgent: text("user_agent"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});