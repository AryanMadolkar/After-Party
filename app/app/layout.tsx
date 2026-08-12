import { requireCurrentUser } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/dashboard/app-header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Middleware already enforces auth for /app/*; calling this here does
  // two more things: it syncs the Clerk user into Neon on first access,
  // and it makes the resolved user available (via React's cache()) to
  // every server component/action rendered below without a second query.
  await requireCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
