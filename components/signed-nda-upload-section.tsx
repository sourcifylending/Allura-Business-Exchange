"use client";

import { useState } from "react";
import { PageCard } from "@/components/page-card";
import type { DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";
import { updateBuyerFieldAction } from "@/app/admin/digital-assets/actions";

type SignedNDAUploadSectionProps = Readonly<{
  buyer: DigitalAssetBuyerInterestRow;
  assetId: string;
  buyerId: string;
}>;

export function SignedNDAUploadSection({ buyer, buyerId }: SignedNDAUploadSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage({ type: "error", text: "Only PDF files are supported" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // For MVP, we'll store the file URL as a placeholder
      // In production, this would upload to Supabase Storage
      const fileUrl = `uploaded-${Date.now()}-${file.name}`;

      const updated = await updateBuyerFieldAction(buyerId, {
        signed_nda_url: fileUrl,
        nda_signed_date: new Date().toISOString(),
      });

      setMessage({ type: "success", text: "Signed NDA uploaded successfully" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage({ type: "error", text: "Failed to upload signed NDA" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageCard title="Signed NDA" description="Upload the signed NDA document">
      <div className="grid gap-3">
        {buyer.signed_nda_url ? (
          <div className="rounded-lg bg-green-50/50 border border-green-200 p-3">
            <p className="text-xs font-semibold text-green-900">✓ Signed NDA on file</p>
            <p className="text-xs text-green-800 mt-1">{buyer.signed_nda_url}</p>
            {buyer.nda_signed_date && (
              <p className="text-xs text-green-700 mt-1">
                Uploaded: {new Date(buyer.nda_signed_date).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-ink-200 p-6 text-center">
            <p className="text-xs font-semibold text-ink-600 mb-3">Upload Signed NDA</p>
            <label className="inline-block">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <span className="inline-block rounded-lg bg-accent-600 px-4 py-2 text-xs font-medium text-white hover:bg-accent-700 cursor-pointer disabled:opacity-50">
                {uploading ? "Uploading..." : "Choose PDF"}
              </span>
            </label>
            <p className="text-xs text-ink-500 mt-2">PDF files only</p>
          </div>
        )}

        {message && (
          <div
            className={`rounded-lg px-3 py-2 text-xs ${
              message.type === "success"
                ? "bg-green-50 text-green-900 border border-green-200"
                : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </PageCard>
  );
}
