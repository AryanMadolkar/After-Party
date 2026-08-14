import type { Metadata } from "next";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { listOAuthAccountsForUser } from "@/lib/db/queries/users";
import { Separator } from "@/components/ui/separator";
import { NameForm } from "@/components/settings/name-form";
import { PasswordForm } from "@/components/settings/password-form";
import { SignOutButton } from "@/components/settings/sign-out-button";

export const metadata: Metadata = {
  title: "Settings",
};

const PROVIDER_LABEL: Record<string, string> = {
  google: "Google",
};

export default async function SettingsPage() {
  const user = await requireCurrentUser();
  const linkedAccounts = await listOAuthAccountsForUser(user.id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-serif text-3xl tracking-tight">Settings</h1>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-sm font-medium text-muted-foreground">Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <NameForm initialName={user.name ?? ""} />
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-sm font-medium text-muted-foreground">Password</h2>
          <div className="mt-4">
            <PasswordForm hasExistingPassword={Boolean(user.passwordHash)} />
          </div>
        </section>

        {linkedAccounts.length > 0 && (
          <>
            <Separator />
            <section>
              <h2 className="text-sm font-medium text-muted-foreground">Linked accounts</h2>
              <ul className="mt-4 space-y-2">
                {linkedAccounts.map((account) => (
                  <li key={account.provider} className="text-sm">
                    {PROVIDER_LABEL[account.provider] ?? account.provider}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <Separator />

        <section>
          <SignOutButton />
        </section>
      </div>
    </div>
  );
}
