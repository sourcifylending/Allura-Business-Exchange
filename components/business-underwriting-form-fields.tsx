import type { ReactNode } from "react";
import { riskLevelLabels, underwritingStatusLabels } from "@/lib/business-underwriting";
import type { BusinessUnderwritingRecord } from "@/lib/business-underwriting";

const statusOptions = Object.entries(underwritingStatusLabels) as Array<
  [keyof typeof underwritingStatusLabels, string]
>;
const riskOptions = Object.entries(riskLevelLabels) as Array<[keyof typeof riskLevelLabels, string]>;

export function BusinessUnderwritingFormFields({
  record,
  submitLabel,
}: Readonly<{
  record?: Partial<BusinessUnderwritingRecord>;
  submitLabel: string;
}>) {
  return (
    <>
      <input type="hidden" name="id" value={record?.id ?? ""} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Business name">
          <input name="business_name" defaultValue={record?.business_name ?? ""} required className={inputClass} />
        </Field>
        <Field label="Industry">
          <input name="industry" defaultValue={record?.industry ?? ""} required className={inputClass} />
        </Field>
        <Field label="Location">
          <input name="location" defaultValue={record?.location ?? ""} required className={inputClass} />
        </Field>
        <Field label="Years in business">
          <input
            name="years_in_business"
            defaultValue={record?.years_in_business ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Monthly revenue range">
          <input
            name="monthly_revenue_range"
            defaultValue={record?.monthly_revenue_range ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Cash flow range">
          <input
            name="cash_flow_range"
            defaultValue={record?.cash_flow_range ?? ""}
            required
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="SDE / owner benefit">
          <input
            name="sde_owner_benefit"
            defaultValue={record?.sde_owner_benefit ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Debt / MCA / lien status">
          <input
            name="debt_mca_lien_status"
            defaultValue={record?.debt_mca_lien_status ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Customer concentration">
          <input
            name="customer_concentration"
            defaultValue={record?.customer_concentration ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Owner dependence">
          <input
            name="owner_dependence"
            defaultValue={record?.owner_dependence ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Transferability">
          <input
            name="transferability"
            defaultValue={record?.transferability ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Margin quality">
          <input
            name="margin_quality"
            defaultValue={record?.margin_quality ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Growth opportunity">
          <input
            name="growth_opportunity"
            defaultValue={record?.growth_opportunity ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Closing friction">
          <input
            name="closing_friction"
            defaultValue={record?.closing_friction ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Spread potential">
          <input
            name="spread_potential"
            defaultValue={record?.spread_potential ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Underwriting status">
          <select
            name="underwriting_status"
            defaultValue={record?.underwriting_status ?? "screening"}
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
      </div>

      <Field label="Risk flags">
        <textarea
          name="risk_flags"
          defaultValue={record?.risk_flags?.join(", ") ?? ""}
          rows={3}
          className={inputClass}
        />
      </Field>

      <Field label="Next action">
        <textarea name="next_action" defaultValue={record?.next_action ?? ""} required rows={3} className={inputClass} />
      </Field>

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
      <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200";
