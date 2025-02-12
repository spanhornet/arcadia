"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const getCurrentCandidate = async () => {
    try {
        const result = await db.select().from(schema.currentCandidate)
        return result[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
};
