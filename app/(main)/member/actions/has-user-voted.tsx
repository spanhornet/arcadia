"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { sql, eq, and } from "drizzle-orm";

export const hasUserVoted = async ({
    userId,
    currentCandidateId
} : {
    userId: string,
    currentCandidateId: string,
}) => {
    try {

        const result = await db
            .select()
            .from(schema.votes)
            .where(and(
                eq(schema.votes.userId, userId),
                eq(schema.votes.candidateId, currentCandidateId)
            ))

        console.log(result)
        console.log(result.length > 0)

        return (result.length > 0);
    } catch (error) {
        throw new Error(`${error}`);
    }
};
