"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const createVote = async ({
    userId,
    candidateId,
    vote,
} : {
    userId: string, 
    candidateId: string | undefined,
    vote: boolean | null,
}) => {
    try {
        await db
            .insert(schema.votes)
            .values({
                id: crypto.randomUUID(),
                userId: userId,
                candidateId: candidateId || "",
                vote: vote || false,
                createdAt: sql`NOW()`,
                updatedAt: sql`NOW()`,
            });

        return;
    } catch (error) {
        throw new Error(`${error}`);
    }
};
