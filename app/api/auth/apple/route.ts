import { NextResponse } from "next/server";

import { buildAppleAuthorizationUrl } from "@/lib/auth/oauth/apple";
import { generateState, setOAuthCookies } from "@/lib/auth/oauth/state";

export async function GET(request: Request) {
  const state = generateState();
  // Apple's flow doesn't use PKCE (see lib/auth/oauth/apple.ts); the
  // verifier slot is unused but the cookie helper is shared with Google.
  await setOAuthCookies(state, "unused");

  const redirectUri = new URL("/api/auth/apple/callback", request.url).toString();

  try {
    const authorizationUrl = buildAppleAuthorizationUrl({ state, redirectUri });
    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Apple sign-in isn't configured.";
    return NextResponse.redirect(new URL(`/sign-in?error=${encodeURIComponent(message)}`, request.url));
  }
}
