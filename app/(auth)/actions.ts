"use server";

import { z } from "zod";

import { getUserByEmail } from "@/lib/db/queries/users";
import { createUserWithPassword } from "@/lib/db/mutations/users";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function signUpAction(input: z.infer<typeof signUpSchema>) {
  const data = signUpSchema.parse(input);

  const existing = await getUserByEmail(data.email);
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(data.password);
  const user = await createUserWithPassword({
    email: data.email,
    passwordHash,
    name: data.name,
  });

  await createSession(user.id);
}

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";

export async function signInAction(input: z.infer<typeof signInSchema>) {
  const data = signInSchema.parse(input);

  const user = await getUserByEmail(data.email);
  // Same generic message whether the email doesn't exist or the account
  // has no password (OAuth-only) — don't leak which case it is.
  if (!user || !user.passwordHash) {
    throw new Error(INVALID_CREDENTIALS_MESSAGE);
  }

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) {
    throw new Error(INVALID_CREDENTIALS_MESSAGE);
  }

  await createSession(user.id);
}

export async function signOutAction() {
  await destroySession();
}
