"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";

export const whoHasNotVoted = async (currentCandidateId: string) => {
    try {
        // Step 1: Get all users
        const users = await db.select().from(schema.users);

        // Step 2: Get all voted users for the given candidate
        const votedUsers = await db.select().from(schema.votes).where(eq(schema.votes.candidateId, currentCandidateId));

        // Step 3: Extract user IDs who have voted
        const votedUserIds = new Set(votedUsers.map(vote => vote.userId));

        // Step 4: Filter out users who have voted
        const usersWhoHaveNotVoted = users.filter(user => !votedUserIds.has(user.id));

        // Step 5: Get the names of the users who have not voted
        const names = usersWhoHaveNotVoted.map(user => user.name);

        // Step 6: Return a string of names
        return names;
    } catch (error) {
        throw new Error(`${error}`);
    }
};
