import type { OfferDispositionStatus } from "@/lib/supabase/database.types";
import { offerDispositionLabels } from "@/lib/closeout-ops";

const statusStyles: Record<OfferDispositionStatus, string> = {
  seller_review: "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  seller_interested: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  seller_declined: "border-ink-200 bg-[rgb(var(--surface))] text-ink-600",
  request_follow_up: "border-rose-200 bg-[rgba(52,18,26,0.96)] text-rose-700",
  advance_to_contract: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  close_out: "border-ink-200 bg-[rgb(var(--surface))] text-ink-600",
};

export function OfferDispositionPill({
  status,
}: Readonly<{
  status: OfferDispositionStatus | null;
}>) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
        Not set
      </span>
    );
  }

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        statusStyles[status],
      ].join(" ")}
    >
      {offerDispositionLabels[status]}
    </span>
  );
}
