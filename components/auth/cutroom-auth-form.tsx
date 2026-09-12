"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { signInAction, signUpAction } from "@/app/(auth)/actions";

export function CutRoomAuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "signup") {
        await signUpAction({ name, email, password });
        router.push("/onboarding");
      } else {
        await signInAction({ email, password });
        const dest =
          next && next.startsWith("/") && !next.startsWith("//") ? next : "/app";
        // Layout will bounce to onboarding if the user has no org yet.
        router.push(dest);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
      {mode === "signup" ? (
        <div>
          <label className="cr-label" htmlFor="cr-name">
            Name
          </label>
          <input
            id="cr-name"
            className="cr-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
      ) : null}

      <div>
        <label className="cr-label" htmlFor="cr-email">
          Email
        </label>
        <input
          id="cr-email"
          className="cr-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label className="cr-label" htmlFor="cr-password">
          Password
        </label>
        <input
          id="cr-password"
          className="cr-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          minLength={mode === "signup" ? 8 : undefined}
          required
        />
      </div>

      {error ? (
        <p role="alert" style={{ margin: 0, fontSize: 13, color: "#b3261e" }}>
          {error}
        </p>
      ) : null}

      <button type="submit" className="cr-btn cr-btn-primary" disabled={pending} style={{ marginTop: 4 }}>
        {pending ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
      </button>

      <p className="cr-muted" style={{ margin: 0, fontSize: 13, textAlign: "center" }}>
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--cr-primary-strong)", fontWeight: 600 }}>
              Log in
            </Link>
          </>
        ) : (
          <>
            New to CutRoom?{" "}
            <Link href="/signup" style={{ color: "var(--cr-primary-strong)", fontWeight: 600 }}>
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
