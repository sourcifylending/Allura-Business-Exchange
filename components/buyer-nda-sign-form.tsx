"use client";

import { useState } from "react";

export function BuyerNdaSignForm({ token }: Readonly<{ token: string }>) {
  const [signedName, setSignedName] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!signedName.trim()) {
      setError("Type your full legal name before signing.");
      return;
    }

    if (!consent) {
      setError("You must consent to electronically sign the NDA.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/buyer-invite/sign-nda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, signedName: signedName.trim(), consent }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Unable to sign NDA.");
      }

      window.location.href = `/buyer-invite?token=${encodeURIComponent(token)}&signed=1`;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to sign NDA.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium text-ink-800">
        Type your full legal name
        <input
          name="signed_name"
          value={signedName}
          onChange={(event) => setSignedName(event.target.value)}
          required
          className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-ink-950 outline-none transition focus:border-accent-500"
          placeholder="Full legal name"
        />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6 text-ink-700">
        <input
          name="consent"
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
          className="mt-1"
        />
        <span>I agree to electronically sign the NDA and understand that full review materials unlock only after signature.</span>
      </label>
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-accent-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing NDA..." : "Sign NDA and Unlock Materials"}
      </button>
    </form>
  );
}
