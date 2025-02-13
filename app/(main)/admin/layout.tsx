import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { getInitials } from "@/lib/utils";

// Import components
import { Avatar } from "@/components/ui/avatar";
import { Container } from "@/components/container";
import { ModeToggle } from "@/components/mode-toggle";
import { SignOutButton } from "@/app/(auth)/SignOutButton";
import { CreateCandidateForm } from "./components/CreateCandidateForm";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return redirect("/sign-in");
    }

    const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, session.user.id));

    if (user.role === "MEMBER") {
        return redirect("/member");
    }

    return (
        <>  
            <div className="border-b border-neutral-200 dark:border-b dark:border-neutral-800">
                <Container>
                <nav className="flex items-center justify-between p-4 border-r border-l border-neutral-200 dark:border-r dark:border-l dark:border-neutral-700">
                    <div className="flex items-center gap-4">
                        <Avatar>{getInitials(user.name)}</Avatar>
                    </div>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <CreateCandidateForm />
                        <SignOutButton />
                    </div>
                </nav>
                </Container>
            </div>
            <div className="border-b border-neutral-200 dark:border-b dark:border-neutral-800">
                <Container>
                    <div className="border-r border-l border-neutral-200 dark:border-r dark:border-l dark:border-neutral-700">
                        {children}
                    </div>
                </Container>
            </div>
        </>
    );
}