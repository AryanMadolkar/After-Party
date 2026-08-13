"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { updateUserPassword } from "@/lib/db/mutations/users";

const updateNameSchema = z.object({ name: z.string().trim().min(1).max(120) });

export async function updateNameAction(input: z.infer<typeof updateNameSchema>) {
  const user = await requireCurrentUser();
  const { name } = updateNameSchema.parse(input);

  await db.update(users).set({ name, updatedAt: new Date() }).where(eq(users.id, user.id));
}

const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
});

/**
 * Doubles as both "change password" (current + new) and "set a password"
 * for OAuth-only accounts that have never had one — the current password
 * is only required (and checked) when the account already has a hash.
 */
export async function changePasswordAction(input: z.infer<typeof changePasswordSchema>) {
  const user = await requireCurrentUser();
  const { currentPassword, newPassword } = changePasswordSchema.parse(input);

  if (user.passwordHash) {
    if (!currentPassword || !(await verifyPassword(currentPassword, user.passwordHash))) {
      throw new Error("Current password is incorrect.");
    }
  }

  const newHash = await hashPassword(newPassword);
  await updateUserPassword(user.id, newHash);
}
