"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-2xl tracking-tight">Something went wrong.</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        We hit an unexpected error. Try again — if it keeps happening, please check back shortly.
      </p>
      <Button onClick={reset} className="mt-8 rounded-full px-6">
        Try again
      </Button>
    </div>
  );
}
