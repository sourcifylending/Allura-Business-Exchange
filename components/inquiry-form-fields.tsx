import type { ReactNode } from "react";
import type { BuyerRecord, InquiryRecord } from "@/lib/buyer-ops";
import { inquiryStageLabels, inquiryStatusLabels } from "@/lib/buyer-ops";

const statusOptions = Object.entries(inquiryStatusLabels) as Array<
  [keyof typeof inquiryStatusLabels, string]
>;
const stageOptions = Object.entries(inquiryStageLabels) as Array<[keyof typeof inquiryStageLabels, string]>;

export function InquiryFormFields({
  record,
  buyerOptions,
  submitLabel,
}: Readonly<{
  record?: Partial<InquiryRecord>;
  buyerOptions: BuyerRecord[];
  submitLabel: string;
}>) {
  return (
    <>
      <input type="hidden" name="id" value={record?.id ?? ""} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Source">
          <input name="source" defaultValue={record?.source ?? ""} required className={inputClass} />
        </Field>
        <Field label="Asset interested in">
          <input
            name="asset_interested_in"
            defaultValue={record?.asset_interested_in ?? ""}
            required
            className={inputClass}
          />
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
        <Field label="Timestamp">
          <input name="timestamp" defaultValue={record?.timestamp ?? ""} required className={inputClass} />
        </Field>
        <Field label="Qualification status">
          <select
            name="qualification_status"
            defaultValue={record?.qualification_status ?? "new"}
            required
            className={inputClass}
          >
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Stage">
          <select name="stage" defaultValue={record?.stage ?? "inbox"} required className={inputClass}>
            {stageOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Assigned owner">
          <input
            name="assigned_owner"
            defaultValue={record?.assigned_owner ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Response SLA">
          <input name="response_sla" defaultValue={record?.response_sla ?? ""} required className={inputClass} />
        </Field>
        <Field label="Next step">
          <input name="next_step" defaultValue={record?.next_step ?? ""} required className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Notes summary">
          <textarea
            name="notes_summary"
            defaultValue={record?.notes_summary ?? ""}
            required
            rows={4}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-accent-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          {submitLabel}
        </button>
        <span className="text-xs font-medium tracking-[0.18em] text-ink-500 uppercase">
          Internal admin only
        </span>
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
