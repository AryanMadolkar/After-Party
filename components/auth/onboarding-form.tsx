"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createOrgAction } from "@/app/(auth)/actions";
import { PLAN_LIMITS, type PlanId } from "@/lib/contracts";

const PLANS: Array<{
  id: PlanId;
  name: string;
  priceUsd: number;
  blurb: string;
}> = [
  {
    id: "studio",
    name: "Studio",
    priceUsd: 49,
    blurb: "Solo producers packaging a few client brands.",
  },
  {
    id: "agency",
    name: "Agency",
    priceUsd: 129,
    blurb: "Teams running multi-client shoot weeks.",
  },
  {
    id: "agency_plus",
    name: "Agency+",
    priceUsd: 249,
    blurb: "Larger desks with heavier image volume.",
  },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function OnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [planId, setPlanId] = useState<PlanId>("studio");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const derivedSlug = useMemo(() => slugify(name), [name]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await createOrgAction({
        name,
        slug: (slugTouched ? slug : derivedSlug) || undefined,
        planId,
      });
      router.push("/app");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create organization.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 22 }}>
      <section style={{ display: "grid", gap: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 650, letterSpacing: "-0.02em" }}>
            Agency details
          </h2>
          <p className="cr-muted" style={{ margin: "6px 0 0", fontSize: 14 }}>
            This becomes your CutRoom workspace.
          </p>
        </div>

        <div>
          <label className="cr-label" htmlFor="org-name">
            Organization name
          </label>
          <input
            id="org-name"
            className="cr-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Northstar Creative"
            required
          />
        </div>

        <div>
          <label className="cr-label" htmlFor="org-slug">
            Workspace slug
          </label>
          <input
            id="org-slug"
            className="cr-input"
            value={slugTouched ? slug : derivedSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value.toLowerCase());
            }}
            placeholder="northstar-creative"
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            required
          />
        </div>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 650, letterSpacing: "-0.02em" }}>
            Choose a plan
          </h2>
          <p className="cr-muted" style={{ margin: "6px 0 0", fontSize: 14 }}>
            USD list prices. INR billing available at checkout (coming soon).
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {PLANS.map((plan) => {
            const limits = PLAN_LIMITS[plan.id];
            const selected = planId === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                className="cr-plan-card"
                data-selected={selected}
                onClick={() => setPlanId(plan.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 650, fontSize: 15 }}>{plan.name}</div>
                    <div className="cr-muted" style={{ marginTop: 4, fontSize: 13 }}>
                      {plan.blurb}
                    </div>
                    <div className="cr-muted" style={{ marginTop: 8, fontSize: 12 }}>
                      {limits.clients} clients · {limits.seats} seats · {limits.images.toLocaleString()}{" "}
                      images / mo
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>${plan.priceUsd}</div>
                    <div className="cr-muted" style={{ fontSize: 12 }}>
                      / mo
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {error ? (
        <p role="alert" style={{ margin: 0, fontSize: 13, color: "#b3261e" }}>
          {error}
        </p>
      ) : null}

      <button type="submit" className="cr-btn cr-btn-primary" disabled={pending || !name.trim()}>
        {pending ? "Creating workspace…" : "Create workspace"}
      </button>
    </form>
  );
}
