"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";

export const deleteCurrentCandidate = async () => {
    try {
        await db.delete(schema.currentCandidate);
        return;
    } catch (error) {
        throw new Error(`${error}`);
    }
};
