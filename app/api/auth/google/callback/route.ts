import { NextResponse } from "next/server";

import { exchangeGoogleCodeForProfile } from "@/lib/auth/oauth/google";
import { consumeOAuthCookies } from "@/lib/auth/oauth/state";
import { resolveOAuthUser } from "@/lib/auth/oauth/resolve-account";
import { createSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  const { state: expectedState, verifier } = await consumeOAuthCookies();

  if (!code || !returnedState || !expectedState || !verifier || returnedState !== expectedState) {
    return NextResponse.redirect(
      new URL("/sign-in?error=Google%20sign-in%20failed.%20Please%20try%20again.", request.url),
    );
  }

  try {
    const redirectUri = new URL("/api/auth/google/callback", request.url).toString();
    const profile = await exchangeGoogleCodeForProfile({ code, codeVerifier: verifier, redirectUri });
    const user = await resolveOAuthUser(profile);
    await createSession(user.id);
    return NextResponse.redirect(new URL("/app", request.url));
  } catch (error) {
    console.error("Google sign-in failed", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=Google%20sign-in%20failed.%20Please%20try%20again.", request.url),
    );
  }
}
