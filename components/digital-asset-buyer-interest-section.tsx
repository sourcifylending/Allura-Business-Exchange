"use client";

import { useState } from "react";
import Link from "next/link";
import { PageCard } from "@/components/page-card";
import { addBuyerInterestAction, updateBuyerNDAStatusAction } from "@/app/admin/digital-assets/actions";
import type { DigitalAssetBuyerInterestRow, DigitalAssetBuyerInterestNDAStatus } from "@/lib/supabase/database.types";

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
  const [expandedInterestId, setExpandedInterestId] = useState<string | null>(null);

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

  const handleUpdateNDAStatus = async (
    interestId: string,
    newStatus: DigitalAssetBuyerInterestNDAStatus
  ) => {
    try {
      await updateBuyerNDAStatusAction(interestId, newStatus);
      setInterests(
        interests.map((i) => (i.id === interestId ? { ...i, nda_status: newStatus } : i))
      );
    } catch (error) {
      console.error("Failed to update NDA status:", error);
    }
  };

  const openDocument = (interestId: string, docType: string) => {
    const url = `/api/admin/documents?type=${docType}&buyerInterestId=${interestId}&assetId=${assetId}`;
    window.open(url, "_blank");
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
            <div
              key={interest.id}
              className="rounded-lg border border-ink-200 bg-ink-50/50 p-3 cursor-pointer hover:bg-ink-50 transition"
              onClick={() =>
                setExpandedInterestId(expandedInterestId === interest.id ? null : interest.id)
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-900">{interest.buyer_name}</p>
                  {interest.buyer_email && (
                    <p className="text-xs text-ink-600">{interest.buyer_email}</p>
                  )}
                  <p className="text-xs text-ink-600 capitalize mt-1">
                    {interest.status.replace("_", " ")}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-semibold border ${
                      interest.nda_status === "not_sent"
                        ? "bg-gray-50 text-gray-900 border-gray-200"
                        : interest.nda_status === "sent"
                          ? "bg-blue-50 text-blue-900 border-blue-200"
                          : interest.nda_status === "signed"
                            ? "bg-green-50 text-green-900 border-green-200"
                            : "bg-red-50 text-red-900 border-red-200"
                    }`}
                  >
                    {interest.nda_status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {expandedInterestId === interest.id && (
                <div className="mt-3 grid gap-2 border-t border-ink-200 pt-3">
                  <Link
                    href={`/admin/digital-assets/${assetId}/buyers/${interest.id}`}
                    className="rounded-lg bg-accent-600 px-3 py-2 text-xs font-medium text-white hover:bg-accent-700 transition text-center"
                  >
                    → Open Deal Room
                  </Link>

                  <div className="grid gap-2">
                    <p className="text-xs font-semibold text-ink-600">QUICK ACTIONS</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDocument(interest.id, "nda");
                      }}
                      className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs font-medium text-ink-900 hover:bg-accent-50 hover:border-accent-200 hover:text-accent-700"
                    >
                      📄 View NDA
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDocument(interest.id, "summary");
                      }}
                      className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs font-medium text-ink-900 hover:bg-accent-50 hover:border-accent-200 hover:text-accent-700"
                    >
                      📋 View Summary
                    </button>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-xs font-semibold text-ink-600">NDA STATUS</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        ["not_sent", "sent", "signed", "declined"] as const
                      ).map((status) => (
                        <button
                          key={status}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateNDAStatus(interest.id, status);
                          }}
                          className={`rounded-lg px-2 py-1 text-xs font-medium border transition ${
                            interest.nda_status === status
                              ? "bg-accent-100 border-accent-300 text-accent-900"
                              : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                          }`}
                        >
                          {status.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
