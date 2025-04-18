import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Home() {
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

  if (user.role === "ADMIN") {
    return redirect("/admin");
  } else {
    return redirect("/member");
  }
}
