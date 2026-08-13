import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../models/index.js";

export const getUserByEmail = async(email) => {
    const [existingUser] = await db
            .select({
                id: usersTable.id,
                firstname: usersTable.firstname,
                lastname: usersTable.lastname,
                email: usersTable.email,
                password: usersTable.password,
                salt: usersTable.salt,
                verified: usersTable.verified,
            })
            .from(usersTable)
            .where(eq(usersTable.email, email));

    return existingUser;
}

