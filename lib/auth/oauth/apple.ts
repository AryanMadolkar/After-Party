import "server-only";

import { jwtVerify, createRemoteJWKSet, SignJWT, importPKCS8 } from "jose";

import { serverEnv } from "@/lib/env";
import type { OAuthProfile } from "@/lib/auth/oauth/resolve-account";

const AUTHORIZATION_ENDPOINT = "https://appleid.apple.com/auth/authorize";
const TOKEN_ENDPOINT = "https://appleid.apple.com/auth/token";
const JWKS = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));
const ISSUER = "https://appleid.apple.com";

function requireAppleCredentials() {
  const { APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY } = serverEnv;
  if (!APPLE_CLIENT_ID || !APPLE_TEAM_ID || !APPLE_KEY_ID || !APPLE_PRIVATE_KEY) {
    throw new Error(
      "Apple sign-in isn't configured. Set APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY.",
    );
  }
  return { clientId: APPLE_CLIENT_ID, teamId: APPLE_TEAM_ID, keyId: APPLE_KEY_ID, privateKeyPem: APPLE_PRIVATE_KEY };
}

export function buildAppleAuthorizationUrl(input: { state: string; redirectUri: string }): string {
  const { clientId } = requireAppleCredentials();

  const url = new URL(AUTHORIZATION_ENDPOINT);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("response_type", "code");
  // form_post is required by Apple whenever requesting `name`/`email` scopes.
  url.searchParams.set("response_mode", "form_post");
  url.searchParams.set("scope", "name email");
  url.searchParams.set("state", input.state);
  return url.toString();
}

/**
 * Apple requires the OAuth `client_secret` to be a short-lived JWT signed
 * with the app's Sign In with Apple private key (ES256) — there's no
 * static secret to configure, unlike Google.
 */
async function createAppleClientSecret(): Promise<string> {
  const { clientId, teamId, keyId, privateKeyPem } = requireAppleCredentials();

  // Env vars typically can't hold real newlines, so the PEM is stored with
  // literal "\n" escape sequences and un-escaped here.
  const pem = privateKeyPem.includes("\\n") ? privateKeyPem.replace(/\\n/g, "\n") : privateKeyPem;
  const privateKey = await importPKCS8(pem, "ES256");

  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuedAt()
    .setIssuer(teamId)
    .setAudience(ISSUER)
    .setSubject(clientId)
    .setExpirationTime("5m")
    .sign(privateKey);
}

export async function exchangeAppleCodeForProfile(input: {
  code: string;
  redirectUri: string;
  /** Apple only sends this on the user's very first authorization. */
  formName: string | null;
}): Promise<OAuthProfile> {
  const { clientId } = requireAppleCredentials();
  const clientSecret = await createAppleClientSecret();

  const tokenResponse = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: input.code,
      redirect_uri: input.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Apple token exchange failed: ${await tokenResponse.text()}`);
  }

  const { id_token: idToken } = (await tokenResponse.json()) as { id_token?: string };
  if (!idToken) throw new Error("Apple did not return an id_token.");

  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: ISSUER,
    audience: clientId,
  });

  const email = payload.email as string | undefined;
  if (!email) throw new Error("Apple account has no email.");

  return {
    provider: "apple",
    providerAccountId: String(payload.sub),
    email,
    emailVerified: payload.email_verified === true || payload.email_verified === "true",
    name: input.formName,
    avatarUrl: null, // Apple never provides a profile photo.
  };
}
