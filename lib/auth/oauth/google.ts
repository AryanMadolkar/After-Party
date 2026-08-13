import "server-only";

import { jwtVerify, createRemoteJWKSet } from "jose";

import { serverEnv } from "@/lib/env";
import type { OAuthProfile } from "@/lib/auth/oauth/resolve-account";

const AUTHORIZATION_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

function requireGoogleCredentials() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = serverEnv;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error(
      "Google sign-in isn't configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
    );
  }
  return { clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET };
}

export function buildGoogleAuthorizationUrl(input: {
  state: string;
  codeChallenge: string;
  redirectUri: string;
}): string {
  const { clientId } = requireGoogleCredentials();

  const url = new URL(AUTHORIZATION_ENDPOINT);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", input.state);
  url.searchParams.set("code_challenge", input.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export async function exchangeGoogleCodeForProfile(input: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<OAuthProfile> {
  const { clientId, clientSecret } = requireGoogleCredentials();

  const tokenResponse = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: input.code,
      code_verifier: input.codeVerifier,
      redirect_uri: input.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Google token exchange failed: ${await tokenResponse.text()}`);
  }

  const { id_token: idToken } = (await tokenResponse.json()) as { id_token?: string };
  if (!idToken) throw new Error("Google did not return an id_token.");

  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: ISSUERS,
    audience: clientId,
  });

  const email = payload.email as string | undefined;
  if (!email) throw new Error("Google account has no email.");

  return {
    provider: "google",
    providerAccountId: String(payload.sub),
    email,
    emailVerified: payload.email_verified === true,
    name: (payload.name as string | undefined) ?? null,
    avatarUrl: (payload.picture as string | undefined) ?? null,
  };
}
