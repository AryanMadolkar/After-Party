import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

const AUTH_PAGES = new Set(["/login", "/signup", "/onboarding", "/sign-in", "/sign-up"]);

/**
 * Cheap, DB-free gate: only checks whether a session cookie is present.
 * Authoritative validation happens in requireCurrentUser / AuthGate.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  // Legacy auth URLs → CutRoom routes
  if (pathname === "/sign-in") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (pathname === "/sign-up") {
    const url = request.nextUrl.clone();
    url.pathname = "/signup";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/app") && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && AUTH_PAGES.has(pathname) && pathname !== "/onboarding") {
    // Logged-in users skip login/signup; onboarding stays reachable until org exists
    // (page-level AuthGate sends users with an org to /app).
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
