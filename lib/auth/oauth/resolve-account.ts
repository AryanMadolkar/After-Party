import "server-only";

import { getUserByEmail, getUserByOAuthAccount } from "@/lib/db/queries/users";
import { createUserFromOAuth, linkOAuthAccount } from "@/lib/db/mutations/users";
import type { OAuthProvider, User } from "@/db/schema";

export type OAuthProfile = {
  provider: OAuthProvider;
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  avatarUrl: string | null;
};

/**
 * Resolves a verified OAuth profile to a user row, creating or linking as
 * needed:
 *   1. An account already linked to this exact provider identity wins.
 *   2. Otherwise, link to an existing user with a matching email — but
 *      ONLY when the provider has verified that email itself
 *      (`email_verified` in the ID token). Auto-linking on an unverified
 *      email would let anyone claim an existing account by registering an
 *      OAuth app with a matching-but-unowned email.
 *   3. Otherwise, create a new user and link this identity to it.
 */
export async function resolveOAuthUser(profile: OAuthProfile): Promise<User> {
  const existingByProvider = await getUserByOAuthAccount(profile.provider, profile.providerAccountId);
  if (existingByProvider) return existingByProvider;

  if (profile.emailVerified) {
    const existingByEmail = await getUserByEmail(profile.email);
    if (existingByEmail) {
      await linkOAuthAccount({
        userId: existingByEmail.id,
        provider: profile.provider,
        providerAccountId: profile.providerAccountId,
      });
      return existingByEmail;
    }
  }

  const created = await createUserFromOAuth({
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    emailVerified: profile.emailVerified,
  });
  await linkOAuthAccount({
    userId: created.id,
    provider: profile.provider,
    providerAccountId: profile.providerAccountId,
  });
  return created;
}
