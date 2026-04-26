"use client";

import { useState } from "react";
import { PageCard } from "@/components/page-card";
import { updateAssetNotesAction } from "@/app/admin/digital-assets/actions";
import type { DigitalAssetRow } from "@/lib/supabase/database.types";

type NotesSectionProps = Readonly<{
  asset: DigitalAssetRow;
  assetId: string;
}>;

export function NotesSection({ asset, assetId }: NotesSectionProps) {
  const [notes, setNotes] = useState(asset.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await updateAssetNotesAction(assetId, notes);
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageCard title="Internal Notes" description="Private notes for your team">
      <div className="grid gap-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes here..."
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-mono placeholder-ink-400 focus:outline-none focus:border-accent-500 min-h-[120px]"
        />
        <button
          onClick={handleSaveNotes}
          disabled={isSaving}
          className="w-full rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save notes"}
        </button>
      </div>
    </PageCard>
  );
}
