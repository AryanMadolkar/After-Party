"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createClientAction } from "@/app/(app)/app/clients/actions";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function NewClientForm({
  activeCount,
  limit,
  atLimit,
}: {
  activeCount: number;
  limit: number;
  atLimit: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [externalRef, setExternalRef] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [planLimit, setPlanLimit] = useState(false);
  const [pending, setPending] = useState(false);

  const derivedSlug = useMemo(() => slugify(name), [name]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (atLimit) {
      setPlanLimit(true);
      setError(`Plan allows ${limit} active clients.`);
      return;
    }
    setError(null);
    setPlanLimit(false);
    setPending(true);
    const result = await createClientAction({
      name,
      slug: (slugTouched ? slug : derivedSlug) || undefined,
      externalRef: externalRef.trim() || undefined,
    });
    if (!result.ok) {
      setPlanLimit(result.code === "PLAN_LIMIT_CLIENTS");
      setError(result.error);
      setPending(false);
      return;
    }
    router.push(`/app/clients/${result.client.id}/brand-kit`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18, maxWidth: 480 }}>
      <p className="cr-muted" style={{ margin: 0, fontSize: 14 }}>
        {activeCount} of {limit} clients used on this plan.
      </p>

      {(atLimit || planLimit) && (
        <div className="cr-soft-warn" style={{ borderColor: "rgba(196,92,38,0.35)", background: "rgba(196,92,38,0.08)", color: "var(--cr-accent-hover)" }}>
          You&apos;ve hit the client limit for this plan.{" "}
          <Link href="/app/settings/billing" style={{ fontWeight: 650, textDecoration: "underline" }}>
            Upgrade
          </Link>{" "}
          to add more brands.
        </div>
      )}

      <div className="cr-field-stack">
        <label className="cr-label" htmlFor="client-name">
          Client name
        </label>
        <input
          id="client-name"
          className="cr-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Acme Hospitality"
          required
          maxLength={120}
          disabled={pending || atLimit}
        />
      </div>

      <div className="cr-field-stack">
        <label className="cr-label" htmlFor="client-slug">
          Slug
        </label>
        <input
          id="client-slug"
          className="cr-input"
          value={slugTouched ? slug : derivedSlug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value.toLowerCase());
          }}
          placeholder="acme-hospitality"
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          disabled={pending || atLimit}
        />
      </div>

      <div className="cr-field-stack">
        <label className="cr-label" htmlFor="client-ref">
          External ref <span className="cr-muted">(optional)</span>
        </label>
        <input
          id="client-ref"
          className="cr-input"
          value={externalRef}
          onChange={(e) => setExternalRef(e.target.value)}
          placeholder="CRM id or folder code"
          maxLength={200}
          disabled={pending || atLimit}
        />
      </div>

      {error && !planLimit && (
        <p style={{ margin: 0, color: "var(--cr-reject)", fontSize: 13 }}>{error}</p>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="submit" className="cr-btn cr-btn-primary" disabled={pending || atLimit}>
          {pending ? "Creating…" : "Create client"}
        </button>
        <Link href="/app/clients" className="cr-btn cr-btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
