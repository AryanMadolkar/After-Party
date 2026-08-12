import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/app" className="font-serif text-lg tracking-tight">
          After Party
        </Link>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="gap-1.5 rounded-full px-4">
            <Link href="/app/new">
              <Plus className="size-4" />
              New project
            </Link>
          </Button>
          <UserButton
            appearance={{
              elements: { avatarBox: "size-8" },
            }}
            userProfileMode="navigation"
            userProfileUrl="/app/settings"
          />
        </div>
      </div>
    </header>
  );
}
