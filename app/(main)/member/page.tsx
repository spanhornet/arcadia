import { VoteForm } from "./components/VoteForm";

import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { VoteContainer } from "./components/VoteContainer";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return redirect("/sign-in");
    }

    const [ user ] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, session.user.id));

    return (
        <>
            <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <VoteContainer user={user} />
                </div>
            </div>
        </>
    );
}