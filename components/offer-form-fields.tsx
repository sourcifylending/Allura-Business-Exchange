import type { ReactNode } from "react";
import type { BuyerRecord, OfferRecord } from "@/lib/closeout-ops";
import { offerStageLabels } from "@/lib/closeout-ops";

const stageOptions = Object.entries(offerStageLabels) as Array<[keyof typeof offerStageLabels, string]>;

export function OfferFormFields({
  record,
  buyerOptions,
  returnTo,
  submitLabel,
}: Readonly<{
  record?: Partial<OfferRecord>;
  buyerOptions: BuyerRecord[];
  returnTo?: string;
  submitLabel: string;
}>) {
  return (
    <>
      <input type="hidden" name="id" value={record?.id ?? ""} />
      {returnTo ? <input type="hidden" name="return_to" value={returnTo} /> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Asset name">
          <input name="asset_name" defaultValue={record?.asset_name ?? ""} required className={inputClass} />
        </Field>
        <Field label="Buyer">
          <select name="buyer_id" defaultValue={record?.buyer_id ?? ""} className={inputClass}>
            <option value="">Unassigned</option>
            {buyerOptions.map((buyer) => (
              <option key={buyer.id} value={buyer.id}>
                {buyer.buyer_name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Buyer name">
          <input name="buyer_name" defaultValue={record?.buyer_name ?? ""} required className={inputClass} />
        </Field>
        <Field label="Asking price">
          <input name="asking_price" defaultValue={record?.asking_price ?? ""} required className={inputClass} />
        </Field>
        <Field label="Offer amount">
          <input name="offer_amount" defaultValue={record?.offer_amount ?? ""} required className={inputClass} />
        </Field>
        <Field label="Counteroffer status">
          <input
            name="counteroffer_status"
            defaultValue={record?.counteroffer_status ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Stage">
          <select name="stage" defaultValue={record?.stage ?? "offered"} required className={inputClass}>
            {stageOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Target close date">
          <input type="date" name="target_close_date" defaultValue={record?.target_close_date ?? ""} required className={inputClass} />
        </Field>
        <Field label="Owner">
          <input name="owner" defaultValue={record?.owner ?? ""} required className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Accepted terms">
          <textarea name="accepted_terms" defaultValue={record?.accepted_terms ?? ""} required rows={3} className={inputClass} />
        </Field>
        <Field label="Next action">
          <textarea name="next_action" defaultValue={record?.next_action ?? ""} required rows={3} className={inputClass} />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button type="submit" className="inline-flex items-center justify-center rounded-full bg-accent-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600">
          {submitLabel}
        </button>
        <span className="text-xs font-medium tracking-[0.18em] text-ink-500 uppercase">Internal admin only</span>
      </div>
    </>
  );
}

function Field({
  label,
  children,
}: Readonly<{
  label: string;
  children: ReactNode;
}>) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200";
