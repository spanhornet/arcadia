"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";

export const isCurrentCandidateEmpty = async () => {
    try {

        const result = await db
            .select()
            .from(schema.currentCandidate)

        console.log(result.length === 0)

        return (result.length === 0);
    } catch (error) {
        throw new Error(`${error}`);
    }
};
