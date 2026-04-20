import type { ReactNode } from "react";
import { OfferFormFields } from "@/components/offer-form-fields";
import { OfferStatusPill } from "@/components/offer-status-pill";
import { OfferDispositionPill } from "@/components/offer-disposition-pill";
import { type BuyerRecord, type OfferRecord, updateOfferRecord } from "@/lib/closeout-ops";

export function OfferCard({
  offer,
  editable = false,
  buyerOptions = [],
  returnTo,
}: Readonly<{
  offer: OfferRecord;
  editable?: boolean;
  buyerOptions?: BuyerRecord[];
  returnTo?: string;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Offer Desk
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{offer.asset_name}</h3>
          <div className="mt-1 text-sm text-ink-600">{offer.buyer_name}</div>
        </div>
        <OfferStatusPill stage={offer.stage} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Asking price" value={offer.asking_price} />
        <Detail label="Offer amount" value={offer.offer_amount} />
        <Detail label="Counteroffer status" value={offer.counteroffer_status} />
        <Detail label="Target close date" value={offer.target_close_date} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4">
        <Mini label="Accepted terms" value={offer.accepted_terms} />
        <Mini label="Owner" value={offer.owner} />
        <Mini label="Next action" value={offer.next_action} />
        {"disposition_status" in offer ? (
          <Mini
            label="Disposition"
            value={
              offer.disposition_status ? (
                <span className="inline-flex items-center gap-2">
                  <OfferDispositionPill status={offer.disposition_status} />
                </span>
              ) : (
                "Not set"
              )
            }
          />
        ) : null}
      </div>

      {editable ? (
        <details className="mt-5 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold tracking-[0.16em] text-accent-700 uppercase">
            Edit offer
          </summary>
          <form action={updateOfferRecord} className="mt-5 grid gap-5">
            <OfferFormFields record={offer} buyerOptions={buyerOptions} returnTo={returnTo} submitLabel="Save offer" />
          </form>
        </details>
      ) : null}
    </article>
  );
}

function Detail({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

function Mini({
  label,
  value,
}: Readonly<{
  label: string;
  value: ReactNode;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-700">{value}</div>
    </div>
  );
}
