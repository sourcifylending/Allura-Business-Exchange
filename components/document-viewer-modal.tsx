"use client";

import { useEffect, useState } from "react";
import type { DigitalAssetRow, DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";

type DocumentViewerModalProps = Readonly<{
  documentType: string;
  buyer: DigitalAssetBuyerInterestRow;
  asset: DigitalAssetRow;
  onClose: () => void;
}>;

export function DocumentViewerModal({ documentType, buyer, asset, onClose }: DocumentViewerModalProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(
          `/api/admin/documents?type=${documentType}&buyerInterestId=${buyer.id}&assetId=${asset.id}`
        );
        const content = await response.text();
        setHtml(content);
      } catch (error) {
        console.error("Failed to load document:", error);
        setHtml("<h1>Error loading document</h1>");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentType, buyer.id, asset.id]);

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow && html) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownloadPDF = () => {
    if (!html) return;

    const element = document.createElement("div");
    element.innerHTML = html;

    // Use html2pdf if available, otherwise open print dialog
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => {
      const opt = {
        margin: 0.5,
        filename: `${documentType}-${asset.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "in", format: "letter" },
      };
      (window as any).html2pdf().set(opt).from(element).save();
    };
    document.head.appendChild(script);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-ink-950 capitalize">
              {documentType.replace("_", " ")}
            </h2>
            <p className="text-sm text-ink-600 mt-1">
              {buyer.buyer_name} – {asset.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink-500 hover:text-ink-900 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-ink-600">Loading document...</p>
            </div>
          ) : html ? (
            <iframe
              srcDoc={html}
              className="w-full h-full border-none"
              title={documentType}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-ink-600">Failed to load document</p>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="border-t border-ink-200 bg-ink-50 p-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-white"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-900 hover:bg-ink-50"
          >
            🖨️ Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
          >
            📥 Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
