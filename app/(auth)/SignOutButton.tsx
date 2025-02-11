"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export function SignOutButton({ className }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-out");
          },
        },
      });
    } catch (error) {
      alert(`Sign Out Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleSignOut} className={className} disabled={isLoading}>
      {isLoading ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Signing out
        </>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}
