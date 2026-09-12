"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Clapperboard, Settings, PanelLeft } from "lucide-react";
import { useState } from "react";

import { signOutAction } from "@/app/(auth)/actions";
import type { SessionUser } from "@/lib/contracts";

const NAV = [
  { href: "/app/clients", label: "Clients", icon: Building2 },
  { href: "/app/shoots", label: "Shoots", icon: Clapperboard },
  { href: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function AppNav({
  user,
  orgName,
}: {
  user: SessionUser;
  orgName: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="cr-btn cr-btn-ghost cr-mobile-nav-trigger"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <PanelLeft size={18} />
      </button>

      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="cr-sidebar-backdrop"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`cr-sidebar${open ? " cr-sidebar-open" : ""}`}
        style={{
          width: 240,
          flexShrink: 0,
          borderRight: "1px solid var(--cr-border)",
          background: "var(--cr-sidebar)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid var(--cr-border)" }}>
          <Link href="/app" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              aria-hidden
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, var(--cr-primary), var(--cr-primary-strong))",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              C
            </span>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>CutRoom</span>
          </Link>

          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid var(--cr-border)",
              background: "var(--cr-surface)",
            }}
          >
            <div className="cr-muted" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
              Workspace
            </div>
            <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
              {orgName ?? "Your agency"}
            </div>
          </div>
        </div>

        <nav style={{ padding: 12, display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--cr-primary-strong)" : "var(--cr-ink-muted)",
                  background: active ? "rgba(94, 106, 210, 0.1)" : "transparent",
                }}
              >
                <Icon size={17} strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: 12, borderTop: "1px solid var(--cr-border)" }}>
          <div style={{ fontSize: 13, fontWeight: 550, marginBottom: 2 }}>{user.name ?? "Account"}</div>
          <div className="cr-muted" style={{ fontSize: 12, marginBottom: 10 }}>
            {user.email}
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="cr-btn cr-btn-ghost"
              style={{ width: "100%", justifyContent: "flex-start" }}
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
