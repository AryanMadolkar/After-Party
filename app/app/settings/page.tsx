import type { Metadata } from "next";
import { UserProfile } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-serif text-3xl tracking-tight">Settings</h1>

      <div className="mt-8 flex justify-center">
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-border rounded-2xl w-full",
              scrollBox: "rounded-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
