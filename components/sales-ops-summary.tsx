import { RadarScorePill } from "@/components/radar-score-pill";
import type { BuyerRecord, InquiryRecord } from "@/lib/buyer-ops";

export function SalesOpsSummary({
  buyers,
  inquiries,
}: Readonly<{
  buyers: BuyerRecord[];
  inquiries: InquiryRecord[];
}>) {
  const qualifiedBuyers = buyers.filter((buyer) => buyer.current_stage === "qualified" || buyer.current_stage === "active").length;
  const verifiedFunds = buyers.filter((buyer) => buyer.proof_of_funds_status === "verified").length;
  const qualifiedInquiries = inquiries.filter((inquiry) => inquiry.qualification_status === "qualified").length;

  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Sales Ops Snapshot
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <RadarScorePill label="Qualified Buyers" value={qualifiedBuyers} tone="positive" />
        <RadarScorePill label="Verified Funds" value={verifiedFunds} tone="warning" />
        <RadarScorePill label="Qualified Inquiries" value={qualifiedInquiries} tone="positive" />
      </div>
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
        This is the handoff point between interest, qualification, offers, and future closing flow.
      </div>
    </section>
  );
}

