import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row">
        <p className="font-serif text-base text-foreground">After Party</p>
        <p>Turn hundreds of photos into the perfect post.</p>
        <div className="flex items-center gap-6">
          <Link href="/sign-in" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link href="/sign-up" className="transition-colors hover:text-foreground">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}
