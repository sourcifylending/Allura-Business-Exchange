"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";
import { isAdminHostname, getAdminHostname } from "@/lib/app-url";

function safeNextPath(value: string | null, isAdmin: boolean) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return isAdmin ? "/admin" : "/portal";
  }

  return value;
}

function isCurrentAdminHost() {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  return isAdminHostname(hostname);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [isAdminHost, setIsAdminHost] = useState(false);

  useEffect(() => {
    setIsAdminHost(isCurrentAdminHost());
    setRouteError(new URL(window.location.href).searchParams.get("error"));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Unable to sign in.");
        setLoading(false);
        return;
      }

      const nextPath = safeNextPath(new URL(window.location.href).searchParams.get("next"), isAdminHost);
      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Unable to sign in.");
      setLoading(false);
      return;
    }
  }

  const title = isAdminHost ? "Admin sign-in" : "Buyer / Seller sign-in";
  const description = isAdminHost
    ? "Use your internal admin email and password."
    : "Enter your account credentials to access the portal.";

  return (
    <SiteShell
      eyebrow="App Access"
      title="Sign in to Allura"
      description="Internal app access only. Public pages remain on the marketing site."
      showPublicNav={false}
      showSignInCta={false}
      showHeroPanel={false}
    >
      <PageCard title={title} description={description}>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium text-ink-800">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-ink-950 outline-none transition placeholder:text-ink-500 focus:border-accent-500"
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
              className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-ink-950 outline-none transition placeholder:text-ink-500 focus:border-accent-500"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {routeError === "unauthorized" ? (
            <p className="text-sm text-red-700">
              This account is not authorized for admin access.
            </p>
          ) : null}
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
