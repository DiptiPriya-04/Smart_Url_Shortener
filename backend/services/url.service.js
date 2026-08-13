import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";

export const insertShortCodeIntoTable = async(shortCode, targetURL, userId) => {
    const result = await db.insert(urlsTable).values({
            shortCode: shortCode, 
            targetURL: targetURL,
            userId: userId,
        }).returning({
            id: urlsTable.id,
            shortCode: urlsTable.shortCode, 
            targetURL: urlsTable.targetURL
        });
    return result[0]; 
}

export const urlBelongsToUser = async(id, userId) => {
    const [existingURL] = await db
                .select()
                .from(urlsTable)
                .where(
                    and(
                        eq(urlsTable.id, id),
                        eq(urlsTable.userId, userId)
                    )
                );
    return existingURL;
}

export const updateURLFromTable = async(id, userId, newURL) => {
    const updated = await db
        .update(urlsTable)
        .set({ targetURL: newURL })
        .where(
            and(
                eq(urlsTable.id, id),
                eq(urlsTable.userId, userId)
            )
        )
        .returning({
            id: urlsTable.id,
            shortCode: urlsTable.shortCode, 
            targetURL: urlsTable.targetURL,
        });
    return updated[0]; 
}

export const deleteURLFromTable = async(id, userId) => {
    const result = await db
        .delete(urlsTable)
        .where(
            and(
                eq(urlsTable.id, id),
                eq(urlsTable.userId, userId)
            )
        )
        .returning({
            id: urlsTable.id,
            shortCode: urlsTable.shortCode, 
            targetURL: urlsTable.targetURL,
        });
    return result[0];
}