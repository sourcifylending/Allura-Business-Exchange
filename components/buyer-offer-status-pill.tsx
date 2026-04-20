import type { BuyerOfferSubmissionStatus } from "@/lib/supabase/database.types";
import { buyerOfferStatusLabels } from "@/lib/buyer-offers";

const statusStyles: Record<BuyerOfferSubmissionStatus, string> = {
  submitted: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  under_review: "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  needs_follow_up: "border-rose-200 bg-[rgba(52,18,26,0.96)] text-rose-700",
  approved_to_present: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  converted_to_offer: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  declined: "border-ink-200 bg-[rgb(var(--surface))] text-ink-600",
  withdrawn: "border-ink-200 bg-[rgb(var(--surface))] text-ink-600",
};

export function BuyerOfferStatusPill({
  status,
}: Readonly<{
  status: BuyerOfferSubmissionStatus;
}>) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        statusStyles[status],
      ].join(" ")}
    >
      {buyerOfferStatusLabels[status]}
    </span>
  );
}
