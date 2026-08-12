import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-6xl tracking-tight">404</p>
      <h1 className="mt-4 text-xl font-medium">We couldn&apos;t find that page.</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        It may have been moved, deleted, or the link might be incorrect.
      </p>
      <Button asChild className="mt-8 rounded-full px-6">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
