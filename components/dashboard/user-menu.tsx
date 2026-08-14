"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/(auth)/actions";

export function UserMenu({ initials, email }: { initials: string; email: string | null }) {
  const router = useRouter();

  async function handleSignOut() {
    await signOutAction();
    // "/" reads session state fresh on every render (it's fully dynamic),
    // so push alone already reflects the signed-out state.
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--ap-lime)",
            border: "2px solid var(--ap-ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-archivo), sans-serif",
            fontWeight: 900,
            fontSize: 13,
            cursor: "pointer",
            color: "var(--ap-ink)",
          }}
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        {email && (
          <div className="truncate px-2 py-1.5 text-xs text-muted-foreground">{email}</div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
