import type { Metadata } from "next";
import Link from "next/link";

import { NewClientForm } from "@/components/clients/new-client-form";
import { listClients } from "@/lib/clients/service";

export const metadata: Metadata = {
  title: "New client",
};

export default async function NewClientPage() {
  const { activeCount, limit } = await listClients();
  const atLimit = activeCount >= limit;

  return (
    <div style={{ maxWidth: 560 }}>
      <Link href="/app/clients" className="cr-muted" style={{ fontSize: 13, textDecoration: "none" }}>
        ← Clients
      </Link>
      <h1 style={{ margin: "12px 0 0", fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700 }}>
        New client
      </h1>
      <p className="cr-muted" style={{ margin: "8px 0 24px", fontSize: 15 }}>
        Create the workspace shell — you&apos;ll lock the brand kit next.
      </p>
      <NewClientForm activeCount={activeCount} limit={limit} atLimit={atLimit} />
    </div>
  );
}
