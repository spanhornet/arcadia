"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const createCurrentCandidate = async ({
    candidateId
} : {
    candidateId: string
}) => {
    try {
        const candidate = await db
            .select()
            .from(schema.candidates)
            .where(eq(schema.candidates.id, candidateId))

        await db
            .insert(schema.currentCandidate)
            .values({
                candidateId: candidateId,
                firstName: candidate[0].firstName,
                lastName: candidate[0].lastName,
            });

        return;
    } catch (error) {
        throw new Error(`${error}`);
    }
};
