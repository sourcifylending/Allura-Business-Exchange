import type { ReactNode } from "react";
import type { BuyerOfferSubmissionRecord } from "@/lib/buyer-offers";
import { submitBuyerOfferAction } from "@/lib/buyer-offers";

export function BuyerOfferSubmitForm({
  opportunityId,
  record,
}: Readonly<{
  opportunityId: string;
  record?: BuyerOfferSubmissionRecord | null;
}>) {
  return (
    <form action={submitBuyerOfferAction} className="grid gap-5">
      <input type="hidden" name="asset_packaging_id" value={opportunityId} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Proposed price / range">
          <input
            name="proposed_price"
            defaultValue={record?.proposed_price ?? ""}
            required
            className={inputClass}
            placeholder="$1.8M - $2.2M"
          />
        </Field>
        <Field label="Structure preference">
          <input
            name="structure_preference"
            defaultValue={record?.structure_preference ?? ""}
            required
            className={inputClass}
            placeholder="Cash, seller finance, earnout"
          />
        </Field>
        <Field label="Financing plan">
          <textarea
            name="financing_plan"
            defaultValue={record?.financing_plan ?? ""}
            required
            rows={3}
            className={inputClass}
            placeholder="Cash, SBA, partner capital, mixed structure"
          />
        </Field>
        <Field label="Target close date">
          <input type="date" name="target_close_date" defaultValue={record?.target_close_date ?? ""} required className={inputClass} />
        </Field>
      </div>

      <Field label="Short notes">
        <textarea
          name="notes"
          defaultValue={record?.notes ?? ""}
          required
          rows={4}
          className={inputClass}
          placeholder="Keep this concise and structured."
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-accent-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          Submit offer intent
        </button>
        <span className="text-xs font-medium tracking-[0.18em] text-ink-500 uppercase">
          Internal review only
        </span>
      </div>
    </form>
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
