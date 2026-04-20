import type { ReactNode } from "react";
import { buyerTypeLabels, proofOfFundsLabels } from "@/lib/buyer-ops";

const buyerTypeOptions = Object.entries(buyerTypeLabels) as Array<[keyof typeof buyerTypeLabels, string]>;
const proofOptions = Object.entries(proofOfFundsLabels) as Array<[keyof typeof proofOfFundsLabels, string]>;
const urgencyOptions = ["low", "medium", "high"] as const;

export function BuyerApplicationForm() {
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Applicant name">
          <input name="applicant_name" required className={inputClass} />
        </Field>
        <Field label="Email">
          <input type="email" name="email" required className={inputClass} autoComplete="email" />
        </Field>
        <Field label="Phone">
          <input name="phone" required className={inputClass} autoComplete="tel" />
        </Field>
        <Field label="Buyer type">
          <select name="buyer_type" defaultValue="operator" required className={inputClass}>
            {buyerTypeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget range">
          <input name="budget_range" required className={inputClass} />
        </Field>
        <Field label="Proof of funds">
          <select name="proof_of_funds_status" defaultValue="not_shown" required className={inputClass}>
            {proofOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Urgency">
          <select name="urgency" defaultValue="medium" required className={inputClass}>
            {urgencyOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Niches of interest">
          <textarea
            name="niches_of_interest"
            required
            rows={4}
            placeholder="Comma or line separated"
            className={inputClass}
          />
        </Field>
        <Field label="Asset preferences">
          <textarea
            name="asset_preferences"
            required
            rows={4}
            placeholder="Comma or line separated"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Why are you buying?">
          <textarea name="message" required rows={4} className={inputClass} />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-accent-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          Submit application
        </button>
        <span className="text-xs font-medium tracking-[0.18em] text-ink-500 uppercase">
          Review first, approval only
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
  "w-full rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-500 focus:border-accent-400 focus:ring-2 focus:ring-accent-200";
