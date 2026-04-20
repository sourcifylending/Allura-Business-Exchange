import Link from "next/link";
import type { BuyerOfferSubmissionRecord } from "@/lib/buyer-offers";
import { BuyerOfferStatusPill } from "@/components/buyer-offer-status-pill";
import { BuyerSafeStatusPill } from "@/components/buyer-safe-status-pill";

export function BuyerOfferActivityCard({
  record,
}: Readonly<{
  record: BuyerOfferSubmissionRecord;
}>) {
  return (
    <article className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">{record.niche}</div>
          <div className="mt-1 text-lg font-semibold text-ink-950">{record.asset_name}</div>
          <div className="mt-1 text-sm leading-6 text-ink-600">{record.asset_type}</div>
        </div>
        <div className="grid justify-items-end gap-2">
          <BuyerOfferStatusPill status={record.status} />
          <BuyerSafeStatusPill status={record.buyer_visible_status} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Proposed price" value={record.proposed_price} />
        <Info label="Target close date" value={formatDate(record.target_close_date)} />
      </div>

      <div className="grid gap-3 rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
        <div>Structure: {record.structure_preference}</div>
        <div>Financing: {record.financing_plan}</div>
        <div>Submitted: {formatDate(record.created_at)}</div>
      </div>

      <p className="text-sm leading-6 text-ink-600">{record.portal_summary}</p>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/portal/buyer/offers/${record.id}`}
          className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Open offer detail
        </Link>
        <Link
          href={`/portal/buyer/opportunities/${record.asset_packaging_id}`}
          className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Open opportunity
        </Link>
      </div>
    </article>
  );
}

function Info({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}
