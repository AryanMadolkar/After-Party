"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { archiveClientAction, updateClientAction } from "@/app/(app)/app/clients/actions";
import type { Client } from "@/lib/contracts";

export function ClientsList({
  clients,
  activeCount,
  limit,
  includeArchived,
}: {
  clients: Client[];
  activeCount: number;
  limit: number;
  includeArchived: boolean;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const atLimit = activeCount >= limit;

  function toggleArchived(next: boolean) {
    const params = new URLSearchParams();
    if (next) params.set("archived", "1");
    router.push(params.toString() ? `/app/clients?${params}` : "/app/clients");
  }

  function onArchive(clientId: string) {
    setPendingId(clientId);
    startTransition(async () => {
      await archiveClientAction(clientId);
      setPendingId(null);
      router.refresh();
    });
  }

  function onRestore(clientId: string) {
    setPendingId(clientId);
    startTransition(async () => {
      const result = await updateClientAction(clientId, { status: "active" });
      setPendingId(null);
      if (!result.ok && result.code === "PLAN_LIMIT_CLIENTS") {
        router.push("/app/settings/billing");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 720 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700 }}>Clients</h1>
          <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 15 }}>
            {activeCount} of {limit} clients
            {atLimit ? " — plan full" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--cr-ink-muted)" }}>
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(e) => toggleArchived(e.target.checked)}
            />
            Show archived
          </label>
          {atLimit ? (
            <Link href="/app/settings/billing" className="cr-btn cr-btn-primary">
              Upgrade
            </Link>
          ) : (
            <Link href="/app/clients/new" className="cr-btn cr-btn-primary">
              New client
            </Link>
          )}
        </div>
      </div>

      {atLimit && (
        <div className="cr-soft-warn" style={{ borderColor: "rgba(196,92,38,0.35)", background: "rgba(196,92,38,0.08)", color: "var(--cr-accent-hover)" }}>
          Plan client limit reached.{" "}
          <Link href="/app/settings/billing" style={{ fontWeight: 650, textDecoration: "underline" }}>
            Upgrade billing
          </Link>{" "}
          to add another brand kit.
        </div>
      )}

      {clients.length === 0 ? (
        <div className="cr-card" style={{ padding: 28, textAlign: "center" }}>
          <p className="cr-brand-lock" style={{ justifyContent: "center", margin: "0 auto 12px", width: "fit-content" }}>
            <span className="cr-brand-dot" aria-hidden />
            Brand lock
          </p>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 650 }}>No clients yet</h2>
          <p className="cr-muted" style={{ margin: "8px auto 0", maxWidth: "36ch", fontSize: 14 }}>
            Add a client and lock the brand kit before your first shoot week.
          </p>
          <Link href="/app/clients/new" className="cr-btn cr-btn-primary" style={{ marginTop: 18, display: "inline-flex" }}>
            Create client
          </Link>
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
          {clients.map((client) => (
            <li key={client.id}>
              <div className="cr-list-row">
                <Link href={`/app/clients/${client.id}`} style={{ flex: 1, minWidth: 0, textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontWeight: 650, fontSize: 15 }}>{client.name}</div>
                  <div className="cr-muted" style={{ fontSize: 13, marginTop: 2 }}>
                    {client.slug}
                    {client.status === "archived" ? " · archived" : ""}
                  </div>
                </Link>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Link href={`/app/clients/${client.id}/brand-kit`} className="cr-btn cr-btn-secondary" style={{ fontSize: 13, padding: "8px 12px" }}>
                    Brand kit
                  </Link>
                  {client.status === "active" ? (
                    <button
                      type="button"
                      className="cr-btn cr-btn-ghost"
                      style={{ fontSize: 13 }}
                      disabled={isPending && pendingId === client.id}
                      onClick={() => onArchive(client.id)}
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="cr-btn cr-btn-ghost"
                      style={{ fontSize: 13 }}
                      disabled={isPending && pendingId === client.id}
                      onClick={() => onRestore(client.id)}
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
