"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isAuthError = error.message === "UNAUTHORIZED";

  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <p className="font-serif text-2xl tracking-tight">
        {isAuthError ? "Your session has expired." : "Something went wrong."}
      </p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {isAuthError
          ? "Please sign in again to continue."
          : "We couldn't complete that action. Please try again."}
      </p>
      <div className="mt-8 flex gap-3">
        {isAuthError ? (
          <Button asChild className="rounded-full px-6">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        ) : (
          <>
            <Button variant="outline" asChild className="rounded-full px-6">
              <Link href="/app">Back to dashboard</Link>
            </Button>
            <Button onClick={reset} className="rounded-full px-6">
              Try again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
