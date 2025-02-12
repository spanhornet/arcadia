"use server"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const updateUsersRole = async ({
  role, 
  userId
} : {
  role: string, 
  userId: string
}
) => {
  try {
    await db
      .update(schema.users)
      .set({
        role,
        updatedAt: sql`NOW()`,
      })
      .where(eq(schema.users.id, userId));

    return;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
