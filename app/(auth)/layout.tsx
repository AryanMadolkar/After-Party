import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-center border-b border-border/60 py-6">
        <Link href="/" className="font-serif text-xl tracking-tight">
          After Party
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-16">{children}</main>
    </div>
  );
}
