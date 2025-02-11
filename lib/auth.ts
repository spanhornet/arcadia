import { db } from "@/db";
import { schema } from "@/db/schema";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
            user: schema.users,
        },
        usePlural: true,
    }),
    emailAndPassword: {  
        enabled: true
    },
    plugins: [nextCookies()],
});