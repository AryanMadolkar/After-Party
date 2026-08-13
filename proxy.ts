import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

/**
 * Cheap, DB-free gate: only checks whether a session cookie is present.
 * This can't tell an expired/revoked session from a valid one — that
 * authoritative check happens in `requireCurrentUser()` (see
 * lib/auth/current-user.ts), which every protected layout calls. Doing the
 * full check here would mean a database round trip on every request across
 * the whole site.
 */
export default function proxy(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/app");
  if (!isProtectedRoute) return NextResponse.next();

  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  if (!hasSession) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
