import type { ReactNode } from "react";
import type { BusinessIntakeRecord } from "@/lib/business-intake";
import { intakeStatusLabels, reviewStatusLabels } from "@/lib/business-intake";

const intakeOptions = Object.entries(intakeStatusLabels) as Array<[keyof typeof intakeStatusLabels, string]>;
const reviewOptions = Object.entries(reviewStatusLabels) as Array<[keyof typeof reviewStatusLabels, string]>;

export function BusinessIntakeFormFields({
  record,
  submitLabel,
}: Readonly<{
  record?: Partial<BusinessIntakeRecord>;
  submitLabel: string;
}>) {
  return (
    <>
      <input type="hidden" name="id" value={record?.id ?? ""} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Legal business name">
          <input
            name="legal_business_name"
            defaultValue={record?.legal_business_name ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="DBA">
          <input name="dba" defaultValue={record?.dba ?? ""} required className={inputClass} />
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
        <Field label="Number of employees">
          <input
            name="number_of_employees"
            defaultValue={record?.number_of_employees ?? ""}
            required
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Monthly revenue range">
          <input
            name="monthly_revenue_range"
            defaultValue={record?.monthly_revenue_range ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Cash flow / profit range">
          <input
            name="cash_flow_profit_range"
            defaultValue={record?.cash_flow_profit_range ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Reason for selling">
          <textarea
            name="reason_for_selling"
            defaultValue={record?.reason_for_selling ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Debt / liens / MCA disclosure">
          <textarea
            name="debt_liens_mca_disclosure"
            defaultValue={record?.debt_liens_mca_disclosure ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Owner involvement">
          <textarea
            name="owner_involvement"
            defaultValue={record?.owner_involvement ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Equipment / assets">
          <textarea
            name="equipment_assets"
            defaultValue={record?.equipment_assets ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Transferability notes">
          <textarea
            name="transferability_notes"
            defaultValue={record?.transferability_notes ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Uploads placeholder list">
          <textarea
            name="uploads_placeholder_list"
            defaultValue={record?.uploads_placeholder_list?.join(", ") ?? ""}
            rows={3}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Intake status">
          <select
            name="intake_status"
            defaultValue={record?.intake_status ?? "new"}
            required
            className={inputClass}
          >
            {intakeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Review status">
          <select
            name="review_status"
            defaultValue={record?.review_status ?? "pending"}
            required
            className={inputClass}
          >
            {reviewOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Next action">
        <textarea
          name="next_action"
          defaultValue={record?.next_action ?? ""}
          required
          rows={3}
          className={inputClass}
        />
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
