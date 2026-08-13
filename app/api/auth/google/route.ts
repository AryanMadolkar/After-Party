import { NextResponse } from "next/server";

import { buildGoogleAuthorizationUrl } from "@/lib/auth/oauth/google";
import { generatePkce, generateState, setOAuthCookies } from "@/lib/auth/oauth/state";

export async function GET(request: Request) {
  const state = generateState();
  const { verifier, challenge } = generatePkce();
  await setOAuthCookies(state, verifier);

  const redirectUri = new URL("/api/auth/google/callback", request.url).toString();

  try {
    const authorizationUrl = buildGoogleAuthorizationUrl({ state, codeChallenge: challenge, redirectUri });
    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google sign-in isn't configured.";
    return NextResponse.redirect(new URL(`/sign-in?error=${encodeURIComponent(message)}`, request.url));
  }
}
