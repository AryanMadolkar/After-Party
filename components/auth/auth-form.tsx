"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signInAction, signUpAction } from "@/app/(auth)/actions";

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  display: "block",
  marginBottom: 6,
  textTransform: "uppercase",
  color: "var(--ap-ink-50)",
};

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "transparent",
  border: "2px solid var(--ap-ink)",
  color: "var(--ap-ink)",
  padding: "12px 14px",
  fontSize: 14,
  fontFamily: "var(--font-onest), sans-serif",
};

export function AuthForm({
  mode,
  initialError = null,
}: {
  mode: "sign-in" | "sign-up";
  initialError?: string | null;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "sign-up") {
        await signUpAction({ name, email, password });
      } else {
        await signInAction({ email, password });
      }
      // /app reads the session fresh via cookies() on every render (it's
      // fully dynamic), so push alone already reflects the new session —
      // an additional router.refresh() here just raced a second RSC fetch
      // against the one push() already triggers.
      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {mode === "sign-up" && (
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL_STYLE}>name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={INPUT_STYLE}
          />
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={LABEL_STYLE}>email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          style={INPUT_STYLE}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={LABEL_STYLE}>password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          minLength={mode === "sign-up" ? 8 : undefined}
          required
          style={INPUT_STYLE}
        />
      </div>

      {error && (
        <p style={{ margin: "14px 0 0", fontSize: 12.5, color: "#b3261e" }} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="ap-flash"
        disabled={pending}
        style={{
          width: "100%",
          background: "var(--ap-lime)",
          color: "var(--ap-ink)",
          border: "2px solid var(--ap-ink)",
          padding: 15,
          fontWeight: 800,
          fontSize: 14,
          textTransform: "uppercase",
          cursor: pending ? "default" : "pointer",
          fontFamily: "var(--font-onest), sans-serif",
          marginTop: 22,
          opacity: pending ? 0.6 : 1,
        }}
      >
        {pending ? "please wait..." : mode === "sign-up" ? "create account" : "sign in"}
      </button>
    </form>
  );
}
