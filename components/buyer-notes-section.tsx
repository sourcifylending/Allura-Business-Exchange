"use client";

import { useState } from "react";
import { PageCard } from "@/components/page-card";
import type { DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";
import { updateBuyerFieldAction } from "@/app/admin/digital-assets/actions";

type BuyerNotesSectionProps = Readonly<{
  buyer: DigitalAssetBuyerInterestRow;
  assetId: string;
  buyerId: string;
  setBuyerData: (buyer: DigitalAssetBuyerInterestRow) => void;
}>;

export function BuyerNotesSection({ buyer, buyerId, setBuyerData }: BuyerNotesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(buyer.notes || "");

  const handleSave = async () => {
    try {
      const updated = await updateBuyerFieldAction(buyerId, {
        notes,
      });
      setBuyerData(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update notes:", error);
    }
  };

  return (
    <PageCard title="Notes" description="Internal notes and deal status">
      {!isEditing && (
        <div className="grid gap-3">
          {buyer.notes ? (
            <div className="rounded-lg bg-ink-50/50 border border-ink-200 p-3">
              <p className="text-sm text-ink-700 whitespace-pre-wrap">{buyer.notes}</p>
            </div>
          ) : (
            <p className="text-xs text-ink-600 italic">No notes yet</p>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg border border-ink-200 px-3 py-2 text-xs font-medium text-ink-600 hover:bg-ink-50"
          >
            {buyer.notes ? "Edit" : "Add Note"}
          </button>
        </div>
      )}

      {isEditing && (
        <div className="grid gap-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes about this buyer..."
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:outline-none focus:border-accent-500 min-h-[120px] resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-lg bg-accent-600 px-3 py-2 text-xs font-medium text-white hover:bg-accent-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNotes(buyer.notes || "");
              }}
              className="rounded-lg border border-ink-200 px-3 py-2 text-xs font-medium hover:bg-ink-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </PageCard>
  );
}
