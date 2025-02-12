"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const createCandidate = async ({
    firstName,
    lastName,
} : {
    firstName: string, 
    lastName: string,
}) => {
    try {
        await db
            .insert(schema.candidates)
            .values({
                id: crypto.randomUUID(),
                firstName: firstName,
                lastName: lastName,
                createdAt: sql`NOW()`,
                updatedAt: sql`NOW()`,
            });

        return;
    } catch (error) {
        throw new Error(`${error}`);
    }
};
