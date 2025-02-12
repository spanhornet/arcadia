"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const getAllCandidates = async () => {
    try {
        return await db.select().from(schema.candidates);;
    } catch (error) {
        throw new Error(`${error}`);
    }
};
