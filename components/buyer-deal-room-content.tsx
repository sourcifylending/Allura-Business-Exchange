"use client";

import { useState } from "react";
import { PageCard } from "@/components/page-card";
import type { DigitalAssetRow, DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";
import { DocumentViewerModal } from "@/components/document-viewer-modal";
import { BuyerContactCard } from "@/components/buyer-contact-card";
import { BuyerStatusBoard } from "@/components/buyer-status-board";
import { BuyerNotesSection } from "@/components/buyer-notes-section";
import { SignedNDAUploadSection } from "@/components/signed-nda-upload-section";

type BuyerDealRoomContentProps = Readonly<{
  asset: DigitalAssetRow;
  buyer: DigitalAssetBuyerInterestRow;
}>;

export function BuyerDealRoomContent({ asset, buyer }: BuyerDealRoomContentProps) {
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [buyerData, setBuyerData] = useState(buyer);

  const openDocument = (docType: string) => {
    setSelectedDocument(docType);
    setShowDocumentModal(true);
  };

  const canAccessPostNDAContent = buyerData.nda_status === "signed";

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 grid gap-6">
          {/* Buyer Contact Info */}
          <BuyerContactCard buyer={buyerData} assetId={asset.id} buyerId={buyerData.id} />

          {/* Document Generator */}
          <PageCard
            title="Generate Documents"
            description="Create buyer materials from templates"
          >
            <div className="grid gap-3">
              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-600">
                  Pre-NDA Documents
                </p>
                <button
                  onClick={() => openDocument("nda")}
                  className="rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 hover:bg-accent-50 hover:border-accent-200 hover:text-accent-700 transition"
                >
                  📄 Generate & Preview NDA
                </button>
                <button
                  onClick={() => openDocument("summary")}
                  className="rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 hover:bg-accent-50 hover:border-accent-200 hover:text-accent-700 transition"
                >
                  📋 Generate & Preview Summary
                </button>
              </div>

              {canAccessPostNDAContent && (
                <div className="grid gap-2 pt-3 border-t border-ink-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-600">
                    Post-NDA Documents
                  </p>
                  <button
                    onClick={() => openDocument("presentation")}
                    className="rounded-lg border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm font-medium text-green-900 hover:bg-green-100 transition"
                  >
                    🎯 Generate Presentation Outline
                  </button>
                  <button
                    onClick={() => openDocument("checklist")}
                    className="rounded-lg border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm font-medium text-green-900 hover:bg-green-100 transition"
                  >
                    ✓ Generate Data Room Checklist
                  </button>
                  <button
                    onClick={() => openDocument("email")}
                    className="rounded-lg border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm font-medium text-green-900 hover:bg-green-100 transition"
                  >
                    ✉️ Generate Follow-Up Email
                  </button>
                </div>
              )}

              {!canAccessPostNDAContent && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3 text-xs text-amber-900">
                  <p className="font-semibold">Post-NDA documents unlock after NDA is signed</p>
                  <p className="mt-1">Current NDA status: <strong>{buyerData.nda_status.replace("_", " ")}</strong></p>
                </div>
              )}
            </div>
          </PageCard>

          {/* Signed NDA Upload */}
          <SignedNDAUploadSection buyer={buyerData} assetId={asset.id} buyerId={buyerData.id} />

          {/* Notes Section */}
          <BuyerNotesSection buyer={buyerData} assetId={asset.id} buyerId={buyerData.id} setBuyerData={setBuyerData} />
        </div>

        <div className="grid gap-6">
          {/* Status Tracking */}
          <BuyerStatusBoard buyer={buyerData} assetId={asset.id} buyerId={buyerData.id} setBuyerData={setBuyerData} />

          {/* Asset Info */}
          <PageCard title="Asset" description="">
            <div className="grid gap-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Name</p>
                <p className="mt-1 font-medium text-ink-900">{asset.name}</p>
              </div>
              {asset.asking_price && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Asking Price</p>
                  <p className="mt-1 text-lg font-bold text-ink-950">${asset.asking_price.toLocaleString()}</p>
                </div>
              )}
              {asset.revenue_stage && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Revenue Stage</p>
                  <p className="mt-1 text-ink-900">{asset.revenue_stage}</p>
                </div>
              )}
            </div>
          </PageCard>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showDocumentModal && selectedDocument && (
        <DocumentViewerModal
          documentType={selectedDocument}
          buyer={buyerData}
          asset={asset}
          onClose={() => {
            setShowDocumentModal(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}
