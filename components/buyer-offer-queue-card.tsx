import Link from "next/link";
import { BuyerOfferStatusPill } from "@/components/buyer-offer-status-pill";
import { OfferDispositionPill } from "@/components/offer-disposition-pill";
import {
  buyerOfferSubmissionStatusOrder,
  promoteBuyerOfferSubmissionAction,
  updateBuyerOfferSubmissionStatusAction,
} from "@/lib/buyer-offers";
import type { BuyerOfferAdminRecord } from "@/lib/buyer-offers";

export function BuyerOfferQueueCard({
  record,
}: Readonly<{
  record: BuyerOfferAdminRecord;
}>) {
  const closingSummary = record.closing_summary;

  return (
    <article className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">{record.buyer_name}</div>
          <div className="mt-1 text-sm leading-6 text-ink-600">{record.buyer_email}</div>
        </div>
        <div className="grid justify-items-end gap-2">
          <BuyerOfferStatusPill status={record.status} />
          <OfferDispositionPill status={record.offer_disposition_status} />
          {closingSummary ? <ClosingPill label={closingSummary.closing_status.replaceAll("_", " ")} /> : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Info label="Opportunity" value={record.asset_name} />
        <Info label="Proposed price" value={record.proposed_price} />
        <Info label="Close date" value={new Date(record.target_close_date).toLocaleDateString()} />
        <Info label="Structure" value={record.structure_preference} />
        <Info label="Financing" value={record.financing_plan} />
        <Info label="Status" value={record.status.replaceAll("_", " ")} />
        <Info label="Buyer-visible" value={record.buyer_visible_status} />
        <Info label="Closing" value={closingSummary?.buyer_visible_status ?? "No closing opened yet"} />
      </div>

      <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
        Submitted {new Date(record.created_at).toLocaleDateString()}
      </div>

      <div className="grid gap-3">
        <form action={updateBuyerOfferSubmissionStatusAction} className="grid gap-3">
          <input type="hidden" name="id" value={record.id} />
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Admin status</span>
            <select name="status" defaultValue={record.status} className={inputClass}>
              {buyerOfferSubmissionStatusOrder().map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Admin notes</span>
            <textarea name="admin_notes" defaultValue={record.admin_notes} rows={3} className={inputClass} />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
            >
              Save review
            </button>
          </div>
        </form>

        {!record.offer_record_id ? (
          <form action={promoteBuyerOfferSubmissionAction}>
            <input type="hidden" name="id" value={record.id} />
            <button
              type="submit"
              className="rounded-full border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-600"
            >
              Create internal offer record
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-4 py-3 text-sm font-semibold text-emerald-700">
            Linked to internal offer record
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/deals/buyer-offers/${record.id}`}
          className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Open detail
        </Link>
        {closingSummary ? (
          <Link
            href={`/admin/deals/closing-desk/${closingSummary.id}`}
            className="rounded-full border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-600"
          >
            Open closing desk
          </Link>
        ) : null}
        <Link
          href={`/portal/buyer/opportunities/${record.asset_packaging_id}`}
          className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
        >
          Open opportunity
        </Link>
        <Link
          href={`/admin/applications/buyers/${record.buyer_application_id}`}
          className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
        >
          Open buyer application
        </Link>
      </div>
    </article>
  );
}

function ClosingPill({
  label,
}: Readonly<{
  label: string;
}>) {
  return (
    <span className="rounded-full border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
      Closing {label}
    </span>
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

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200";
