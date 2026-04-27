"use client";

import { PageCard } from "@/components/page-card";
import type { DigitalAssetBuyerInterestRow, DigitalAssetBuyerInterestNDAStatus } from "@/lib/supabase/database.types";
import { updateBuyerFieldAction } from "@/app/admin/digital-assets/actions";

type BuyerStatusBoardProps = Readonly<{
  buyer: DigitalAssetBuyerInterestRow;
  assetId: string;
  buyerId: string;
  setBuyerData: (buyer: DigitalAssetBuyerInterestRow) => void;
}>;

export function BuyerStatusBoard({ buyer, buyerId, setBuyerData }: BuyerStatusBoardProps) {
  const ndaStatusColors: Record<string, string> = {
    not_sent: "bg-gray-50 text-gray-900 border-gray-200",
    sent: "bg-blue-50 text-blue-900 border-blue-200",
    signed: "bg-green-50 text-green-900 border-green-200",
    declined: "bg-red-50 text-red-900 border-red-200",
  };

  const buyerStageColors: Record<string, string> = {
    new: "bg-gray-50 text-gray-900 border-gray-200",
    nda_sent: "bg-blue-50 text-blue-900 border-blue-200",
    nda_signed: "bg-green-50 text-green-900 border-green-200",
    reviewing: "bg-amber-50 text-amber-900 border-amber-200",
    offer: "bg-purple-50 text-purple-900 border-purple-200",
    closed: "bg-emerald-50 text-emerald-900 border-emerald-200",
    dead: "bg-red-50 text-red-900 border-red-200",
  };

  const handleNDAStatusChange = async (status: DigitalAssetBuyerInterestNDAStatus) => {
    try {
      const updated = await updateBuyerFieldAction(buyerId, {
        nda_status: status,
        nda_sent_date: status === "sent" && !buyer.nda_sent_date ? new Date().toISOString() : undefined,
        nda_signed_date: status === "signed" && !buyer.nda_signed_date ? new Date().toISOString() : undefined,
      });
      setBuyerData(updated);
    } catch (error) {
      console.error("Failed to update NDA status:", error);
    }
  };

  const handleBuyerStageChange = async (stage: string) => {
    try {
      const updated = await updateBuyerFieldAction(buyerId, {
        buyer_stage: stage,
      });
      setBuyerData(updated);
    } catch (error) {
      console.error("Failed to update buyer stage:", error);
    }
  };

  return (
    <div className="grid gap-6">
      {/* NDA Status */}
      <PageCard title="NDA Status" description="">
        <div className="grid gap-3">
          <div
            className={`rounded-lg border px-4 py-3 text-center ${ndaStatusColors[buyer.nda_status] || ndaStatusColors.not_sent}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide">Current Status</p>
            <p className="mt-2 text-lg font-bold capitalize">{buyer.nda_status.replace("_", " ")}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(["not_sent", "sent", "signed", "declined"] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleNDAStatusChange(status)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                  buyer.nda_status === status
                    ? "bg-accent-100 border-accent-300 text-accent-900"
                    : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>

          {buyer.nda_sent_date && (
            <p className="text-xs text-ink-600">
              Sent: {new Date(buyer.nda_sent_date).toLocaleDateString()}
            </p>
          )}
          {buyer.nda_signed_date && (
            <p className="text-xs text-ink-600">
              Signed: {new Date(buyer.nda_signed_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </PageCard>

      {/* Buyer Stage */}
      <PageCard title="Buyer Stage" description="">
        <div className="grid gap-3">
          <div
            className={`rounded-lg border px-4 py-3 text-center ${buyerStageColors[buyer.buyer_stage || "new"] || buyerStageColors.new}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide">Current Stage</p>
            <p className="mt-2 text-lg font-bold capitalize">{(buyer.buyer_stage || "new").replace("_", " ")}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(["new", "nda_sent", "nda_signed", "reviewing", "offer", "closed", "dead"] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => handleBuyerStageChange(stage)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                  (buyer.buyer_stage || "new") === stage
                    ? "bg-accent-100 border-accent-300 text-accent-900"
                    : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                }`}
              >
                {stage.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </PageCard>

      {/* Next Follow-up */}
      <PageCard title="Follow-up" description="">
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Next Follow-up Date</label>
          <input
            type="date"
            value={buyer.next_follow_up_date ? buyer.next_follow_up_date.toString() : ""}
            onChange={async (e) => {
              try {
                const updated = await updateBuyerFieldAction(buyerId, {
                  next_follow_up_date: e.target.value || null,
                });
                setBuyerData(updated);
              } catch (error) {
                console.error("Failed to update follow-up date:", error);
              }
            }}
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
          />
          {buyer.next_follow_up_date && (
            <p className="text-xs text-ink-600">
              {new Date(buyer.next_follow_up_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </PageCard>
    </div>
  );
}
