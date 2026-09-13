import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AuthError } from "@/lib/contracts";
import { getBrandKit, getClient } from "@/lib/clients/service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clientId: string }>;
}): Promise<Metadata> {
  try {
    const { clientId } = await params;
    const client = await getClient(clientId);
    return { title: client.name };
  } catch {
    return { title: "Client" };
  }
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  let client;
  let kit;
  try {
    client = await getClient(clientId);
    kit = await getBrandKit(clientId);
  } catch (error) {
    if (error instanceof AuthError) notFound();
    throw error;
  }

  return (
    <div style={{ maxWidth: 640, display: "grid", gap: 20 }}>
      <div>
        <Link href="/app/clients" className="cr-muted" style={{ fontSize: 13, textDecoration: "none" }}>
          ← Clients
        </Link>
        <h1 style={{ margin: "12px 0 0", fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700 }}>
          {client.name}
        </h1>
        <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 15 }}>
          {client.slug}
          {client.status === "archived" ? " · archived" : ""}
          {client.externalRef ? ` · ${client.externalRef}` : ""}
        </p>
      </div>

      <div className="cr-card" style={{ padding: 18, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <p className="cr-brand-lock" style={{ width: "fit-content", marginBottom: 8 }}>
              <span className="cr-brand-dot" aria-hidden />
              Brand lock
            </p>
            <div style={{ fontWeight: 650 }}>Completeness {kit.completeness.score}%</div>
            <p className="cr-muted" style={{ margin: "4px 0 0", fontSize: 13 }}>
              {kit.completeness.softWarnings.length > 0
                ? "Soft warnings before first shoot — logo or voice still thin."
                : "Kit looks ready for shoot packaging."}
            </p>
          </div>
          <Link href={`/app/clients/${client.id}/brand-kit`} className="cr-btn cr-btn-primary">
            Edit brand kit
          </Link>
        </div>
        <div className="cr-meter-track" aria-hidden>
          <div className="cr-meter-fill" style={{ width: `${kit.completeness.score}%` }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/app/shoots" className="cr-btn cr-btn-secondary">
          Create first shoot
        </Link>
      </div>
    </div>
  );
}
