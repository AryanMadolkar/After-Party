import Link from "next/link";
import { Show } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl tracking-tight">
          After Party
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
          <Link href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-4">
              <Link href="/sign-up">Create a post</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button asChild size="sm" className="rounded-full px-4">
              <Link href="/app">Go to dashboard</Link>
            </Button>
          </Show>
        </div>
      </div>
    </header>
  );
}
