import "@/app/cutroom.css";

import { getOrganizationById } from "@/lib/db/queries/organizations";
import { listCurrentMemberships } from "@/lib/auth/tenancy";
import { AppNav } from "@/components/layout/app-nav";
import { requireSessionUser } from "@/components/layout/auth-gate";
import { redirect } from "next/navigation";

export default async function AppShellLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSessionUser("/app");
  const memberships = await listCurrentMemberships();

  if (memberships.length === 0) {
    redirect("/onboarding");
  }

  const primary = memberships[0];
  const org = await getOrganizationById(primary.orgId);

  return (
    <div className="cr-scope cr-shell" style={{ display: "flex", minHeight: "100vh" }}>
      <AppNav user={user} orgName={org?.name ?? null} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <main
          style={{
            flex: 1,
            padding: "28px clamp(16px, 3vw, 36px)",
            paddingTop: 56,
          }}
          className="cr-main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
