"use client"

import { authClient } from "@/lib/auth-client";

export function Profile() {
    const { data: session, isPending, error } = authClient.useSession();

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    if (session) {
        return (
        <div>
            <h1>Welcome, {session.user.name}!</h1>
            <p>Email: {session.user.email}</p>
            {/* Display other user properties as needed */}
        </div>
        );
    }

    return <p>Not logged in.</p>;
}