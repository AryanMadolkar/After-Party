import type { Metadata } from "next";

import { requireSessionUser } from "@/components/layout/auth-gate";
import { listCurrentMemberships } from "@/lib/auth/tenancy";
import { getOrganizationById } from "@/lib/db/queries/organizations";
import { signOutAction } from "@/app/(auth)/actions";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await requireSessionUser("/app/settings");
  const memberships = await listCurrentMemberships();
  const org = memberships[0] ? await getOrganizationById(memberships[0].orgId) : null;

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700 }}>Settings</h1>
      <p className="cr-muted" style={{ margin: "8px 0 24px", fontSize: 15 }}>
        Account and workspace basics for this CutRoom desk.
      </p>

      <div className="cr-card" style={{ padding: 20, display: "grid", gap: 14 }}>
        <div>
          <div className="cr-muted" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>
            Signed in as
          </div>
          <div style={{ marginTop: 4, fontWeight: 600 }}>{user.name ?? "—"}</div>
          <div className="cr-muted" style={{ fontSize: 14 }}>
            {user.email}
          </div>
        </div>
        <div style={{ height: 1, background: "var(--cr-border)" }} />
        <div>
          <div className="cr-muted" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>
            Workspace
          </div>
          <div style={{ marginTop: 4, fontWeight: 600 }}>{org?.name ?? "—"}</div>
          <div className="cr-muted" style={{ fontSize: 14 }}>
            {org ? `${org.slug} · ${org.planId}` : "No organization"}
          </div>
        </div>
      </div>

      <form action={signOutAction} style={{ marginTop: 20 }}>
        <button type="submit" className="cr-btn cr-btn-secondary">
          Sign out
        </button>
      </form>
    </div>
  );
}
