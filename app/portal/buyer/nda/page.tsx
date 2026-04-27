"use client";

import { useState } from "react";

export default function NDASignPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token || "";
  const [fullName, setFullName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/portal/sign-nda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName,
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to sign NDA");
      }

      window.location.href = `/portal/buyer?token=${token}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-ink-900">Non-Disclosure Agreement</h1>
        <p className="mt-2 text-sm text-ink-600">SourcifyLending Asset Review - NDA</p>
      </div>

      <div className="rounded-lg border border-ink-200 bg-white p-6">
        <div className="space-y-3 text-sm">
          <h2 className="text-lg font-semibold text-ink-900">Terms</h2>
          <p>
            By accessing this asset review and materials, you agree to maintain confidentiality of all
            proprietary and financial information disclosed. This information is provided solely for your
            evaluation and may not be shared, copied, or used for any purpose other than your assessment
            of the asset.
          </p>

          <h3 className="text-base font-semibold text-ink-900">Key Points:</h3>
          <ul className="list-inside list-disc space-y-1 text-ink-700">
            <li>All materials are confidential and proprietary</li>
            <li>You may not disclose information to third parties without written consent</li>
            <li>This agreement remains in effect for 2 years after access termination</li>
            <li>Unauthorized use may result in legal action</li>
          </ul>

          <p className="mt-4 font-semibold text-ink-900">
            By signing below, you acknowledge that you have read, understood, and agree to be bound by
            this agreement.
          </p>
        </div>
      </div>

      <form onSubmit={handleSign} className="rounded-lg border border-ink-200 bg-white p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-900">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className="mt-1 w-full rounded-lg border border-ink-300 px-3 py-2 text-ink-900 placeholder-ink-500"
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className="mt-1 h-4 w-4"
            />
            <label htmlFor="agree" className="ml-3 text-sm text-ink-700">
              I have read and agree to the terms of this Non-Disclosure Agreement
            </label>
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={!fullName || !agreed || loading}
            className="w-full rounded-lg bg-accent-600 px-4 py-3 font-semibold text-white hover:bg-accent-700 disabled:opacity-50"
          >
            {loading ? "Signing..." : "Sign NDA & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
