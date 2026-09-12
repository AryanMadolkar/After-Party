import "server-only";

import { redirect } from "next/navigation";

import { getSession, listCurrentMemberships } from "@/lib/auth/tenancy";
import type { SessionUser } from "@/lib/contracts";

/**
 * Server-side auth helpers for CutRoom routes.
 * Types come from lib/contracts — do not redefine SessionUser here.
 */
export async function requireSessionUser(nextPath?: string): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    const q = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${q}`);
  }
  return session;
}

/** Redirect signed-in users away from login/signup. */
export async function redirectIfAuthenticated(to = "/app") {
  const session = await getSession();
  if (!session) return null;

  const memberships = await listCurrentMemberships();
  if (memberships.length === 0) {
    redirect("/onboarding");
  }
  redirect(to);
  return session;
}

/** After login/signup: onboarding if no org, else /app (or next). */
export async function resolvePostAuthPath(next?: string | null): Promise<string> {
  const memberships = await listCurrentMemberships();
  if (memberships.length === 0) return "/onboarding";
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/app";
}

/** Onboarding only for signed-in users without an org. */
export async function requireOnboardingSession(): Promise<SessionUser> {
  const session = await requireSessionUser("/onboarding");
  const memberships = await listCurrentMemberships();
  if (memberships.length > 0) {
    redirect("/app");
  }
  return session;
}
