"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAllCandidates = async () => {
    try {
        const users = schema.users
        const votes = schema.votes

        const candidates = await db.select().from(schema.candidates);
        const result = [];

        for (let i = 0; i < candidates.length; i++){
            const candidateVotes = await db
                .select()
                .from(votes)
                .where(eq(votes.candidateId, candidates[i].id));
            
            let positiveVotes = 0;
            let negativeVotes = 0;
            const badges = [];

            for (let j = 0; j < candidateVotes.length; j++) {
                if (candidateVotes[j].vote == true) {
                    positiveVotes++;
                } else {
                    negativeVotes++;
                }
            }

            if (positiveVotes === 0 && negativeVotes === 0) {
                badges.push("N/A")
            } else if (positiveVotes / (positiveVotes + negativeVotes) >= 0.80) {
                badges.push("Pledge")
            } else {
                badges.push("Callback")
            }

            result.push({
                id: candidates[i].id,
                firstName: candidates[i].firstName,
                lastName: candidates[i].lastName,
                createdAt: candidates[i].createdAt,
                updatedAt: candidates[i].updatedAt,
                positiveVotes: positiveVotes,
                negativeVotes: negativeVotes,
                votePercentage: (positiveVotes == 0 && negativeVotes == 0) ? "N/A" : ((positiveVotes / (positiveVotes + negativeVotes)) * 100).toFixed(2),
                badges: badges,
            })   
        }

        return result;
    } catch (error) {
        throw new Error(`${error}`);
    }
};
