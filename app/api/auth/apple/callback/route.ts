import { NextResponse } from "next/server";

import { exchangeAppleCodeForProfile } from "@/lib/auth/oauth/apple";
import { consumeOAuthCookies } from "@/lib/auth/oauth/state";
import { resolveOAuthUser } from "@/lib/auth/oauth/resolve-account";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const code = formData.get("code");
  const returnedState = formData.get("state");
  const userJson = formData.get("user"); // Only present on the first authorization.

  const { state: expectedState } = await consumeOAuthCookies();

  if (
    typeof code !== "string" ||
    typeof returnedState !== "string" ||
    !expectedState ||
    returnedState !== expectedState
  ) {
    return NextResponse.redirect(
      new URL("/sign-in?error=Apple%20sign-in%20failed.%20Please%20try%20again.", request.url),
    );
  }

  let formName: string | null = null;
  if (typeof userJson === "string") {
    try {
      const parsed = JSON.parse(userJson) as { name?: { firstName?: string; lastName?: string } };
      const full = [parsed.name?.firstName, parsed.name?.lastName].filter(Boolean).join(" ");
      formName = full || null;
    } catch {
      formName = null;
    }
  }

  try {
    const redirectUri = new URL("/api/auth/apple/callback", request.url).toString();
    const profile = await exchangeAppleCodeForProfile({ code, redirectUri, formName });
    const user = await resolveOAuthUser(profile);
    await createSession(user.id);
    return NextResponse.redirect(new URL("/app", request.url));
  } catch (error) {
    console.error("Apple sign-in failed", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=Apple%20sign-in%20failed.%20Please%20try%20again.", request.url),
    );
  }
}
