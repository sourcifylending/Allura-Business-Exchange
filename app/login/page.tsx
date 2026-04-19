"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const nextPath = new URL(window.location.href).searchParams.get("next") ?? "/admin";
    router.replace(nextPath);
    router.refresh();
  }

  return (
    <SiteShell
      eyebrow="Admin Access"
      title="Sign in to Allura"
      description="Internal admin access only. Public pages remain open."
    >
      <PageCard title="Admin sign-in" description="Use your internal admin email and password.">
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium text-ink-800">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none transition focus:border-accent-500"
              autoComplete="email"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink-800">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none transition focus:border-accent-500"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-accent-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </PageCard>
    </SiteShell>
  );
}
