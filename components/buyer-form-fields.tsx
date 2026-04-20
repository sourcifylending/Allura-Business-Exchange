import type { ReactNode } from "react";
import { buyerStageLabels, buyerTypeLabels, proofOfFundsLabels } from "@/lib/buyer-ops";
import type { BuyerRecord } from "@/lib/buyer-ops";

const buyerTypeOptions = Object.entries(buyerTypeLabels) as Array<[keyof typeof buyerTypeLabels, string]>;
const proofOptions = Object.entries(proofOfFundsLabels) as Array<[keyof typeof proofOfFundsLabels, string]>;
const stageOptions = Object.entries(buyerStageLabels) as Array<[keyof typeof buyerStageLabels, string]>;
const urgencyOptions = ["low", "medium", "high"] as const;

export function BuyerFormFields({
  record,
  submitLabel,
}: Readonly<{
  record?: Partial<BuyerRecord>;
  submitLabel: string;
}>) {
  return (
    <>
      <input type="hidden" name="id" value={record?.id ?? ""} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Buyer name">
          <input name="buyer_name" defaultValue={record?.buyer_name ?? ""} required className={inputClass} />
        </Field>
        <Field label="Buyer type">
          <select name="buyer_type" defaultValue={record?.buyer_type ?? "operator"} required className={inputClass}>
            {buyerTypeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget">
          <input name="budget" defaultValue={record?.budget ?? ""} required className={inputClass} />
        </Field>
        <Field label="Proof of funds">
          <select
            name="proof_of_funds_status"
            defaultValue={record?.proof_of_funds_status ?? "not_shown"}
            required
            className={inputClass}
          >
            {proofOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Operator / investor">
          <select
            name="operator_or_investor"
            defaultValue={record?.operator_or_investor ?? "operator"}
            required
            className={inputClass}
          >
            {buyerTypeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Urgency">
          <select name="urgency" defaultValue={record?.urgency ?? "medium"} required className={inputClass}>
            {urgencyOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Current stage">
          <select name="current_stage" defaultValue={record?.current_stage ?? "new"} required className={inputClass}>
            {stageOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Next action">
          <input name="next_action" defaultValue={record?.next_action ?? ""} required className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Niches of interest">
          <textarea
            name="niches_of_interest"
            defaultValue={record?.niches_of_interest?.join("\n") ?? ""}
            required
            rows={4}
            className={inputClass}
          />
        </Field>
        <Field label="Asset preferences">
          <textarea
            name="asset_preferences"
            defaultValue={record?.asset_preferences?.join("\n") ?? ""}
            required
            rows={4}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Inquiry history">
          <textarea
            name="inquiry_history"
            defaultValue={record?.inquiry_history ?? ""}
            required
            rows={3}
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
