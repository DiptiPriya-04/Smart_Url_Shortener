import { timestamp, uuid, pgTable, varchar, text, boolean, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),

    firstname: varchar("first_name", { length: 55 }).notNull(),
    lastname: varchar("last_name", { length: 55 }),

    email: varchar("email", { length: 255 }).notNull().unique(),

    password: text("password").notNull(),       
    salt: text("salt").notNull(),               

    verified: boolean("verified").default(false).notNull(),
    role: varchar("role", { length: 20 }).default("user").notNull(),

    verificationCode: text("verification_code"),       
    verificationCodeValidation: integer("verification_code_validation"),

    forgotPasswordCode: text("forgot_password_code"),
    forgotPasswordCodeValidation: integer("forgot_password_code_validation"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
