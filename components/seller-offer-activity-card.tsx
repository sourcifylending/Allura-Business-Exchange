import Link from "next/link";
import type { SellerOfferActivityRecord } from "@/lib/seller-offers";
import { BuyerOfferStatusPill } from "@/components/buyer-offer-status-pill";
import { OfferDispositionPill } from "@/components/offer-disposition-pill";

export function SellerOfferActivityCard({
  record,
}: Readonly<{
  record: SellerOfferActivityRecord;
}>) {
  return (
    <article className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
            Seller opportunity
          </div>
          <div className="mt-1 text-lg font-semibold text-ink-950">{record.asset_name}</div>
          <div className="mt-1 text-sm leading-6 text-ink-600">{record.asset_slug}</div>
        </div>
        <div className="grid gap-2 justify-items-end">
          {record.latest_status ? <BuyerOfferStatusPill status={record.latest_status} /> : null}
          <OfferDispositionPill status={record.latest_offer_disposition_status} />
        </div>
      </div>

      <p className="text-sm leading-6 text-ink-600">{record.portal_summary}</p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Info label="Asking price" value={record.asking_price} />
        <Info label="Offer activity" value={`${record.offer_count} inbound`} />
        <Info label="Converted" value={`${record.converted_offer_count} linked`} />
      </div>

      <div className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
        {record.latest_submission_at ? `Latest activity: ${new Date(record.latest_submission_at).toLocaleDateString()}` : "No offer activity yet."}
      </div>

      <div className="text-sm leading-6 text-ink-700">
        Visibility: {record.packaging_status.replaceAll("_", " ")}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/portal/seller/offers/${record.id}`}
          className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Open detail
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
