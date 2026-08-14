"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/(auth)/actions";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOutAction();
    // "/" reads session state fresh on every render (it's fully dynamic),
    // so push alone already reflects the signed-out state.
    router.push("/");
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
