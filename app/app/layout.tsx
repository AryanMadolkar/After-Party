import { requireCurrentUser } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/dashboard/app-header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // The proxy (middleware) only checks that a session cookie exists;
  // this is the authoritative check — it validates the session against
  // the database and makes the resolved user available (via React's
  // cache()) to every server component/action rendered below without a
  // second query.
  await requireCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
