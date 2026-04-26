"use client";

import { useState } from "react";
import { PageCard } from "@/components/page-card";
import { addBuyerInterestAction } from "@/app/admin/digital-assets/actions";
import type { DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";

type BuyerInterestSectionProps = Readonly<{
  assetId: string;
  initialInterests: DigitalAssetBuyerInterestRow[];
}>;

export function BuyerInterestSection({
  assetId,
  initialInterests,
}: BuyerInterestSectionProps) {
  const [interests, setInterests] = useState(initialInterests);
  const [showForm, setShowForm] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");

  const handleAddInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) return;

    try {
      const newInterest = await addBuyerInterestAction(assetId, buyerName, buyerEmail);
      setInterests([newInterest, ...interests]);
      setBuyerName("");
      setBuyerEmail("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add buyer interest:", error);
    }
  };

  return (
    <PageCard
      title="Buyer Interest"
      description={`${interests.length} lead${interests.length !== 1 ? "s" : ""}`}
    >
      <div className="grid gap-3">
        {showForm && (
          <form onSubmit={handleAddInterest} className="grid gap-2">
            <input
              type="text"
              placeholder="Buyer name..."
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
              autoFocus
            />
            <input
              type="email"
              placeholder="Email (optional)..."
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-accent-600 px-3 py-2 text-xs font-medium text-white hover:bg-accent-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setBuyerName("");
                  setBuyerEmail("");
                }}
                className="rounded-lg border border-ink-200 px-3 py-2 text-xs font-medium hover:bg-ink-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {interests.length === 0 && !showForm && (
          <p className="text-xs text-ink-600">No buyer interest yet.</p>
        )}

        <div className="grid gap-2">
          {interests.map((interest) => (
            <div key={interest.id} className="rounded-lg border border-ink-200 bg-ink-50/50 p-3">
              <p className="text-sm font-medium text-ink-900">{interest.buyer_name}</p>
              {interest.buyer_email && (
                <p className="text-xs text-ink-600">{interest.buyer_email}</p>
              )}
              <p className="text-xs text-ink-600 capitalize mt-1">
                {interest.status.replace("_", " ")}
              </p>
            </div>
          ))}
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg border border-dashed border-ink-300 px-3 py-2 text-xs font-medium text-ink-600 hover:bg-ink-50"
          >
            + Add buyer
          </button>
        )}
      </div>
    </PageCard>
  );
}
