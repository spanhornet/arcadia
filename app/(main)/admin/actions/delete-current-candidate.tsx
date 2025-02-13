"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const deleteCurrentCandidate = async () => {
    try {
        await db.delete(schema.currentCandidate);
        return;
    } catch (error) {
        throw new Error(`${error}`);
    }
};
