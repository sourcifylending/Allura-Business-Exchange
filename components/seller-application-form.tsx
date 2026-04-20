import type { ReactNode } from "react";

const assetTypeOptions = [
  "SaaS",
  "Automation",
  "Directory",
  "Agency",
  "Content site",
  "Newsletter",
  "Digital product",
  "Other",
] as const;

export function SellerApplicationForm() {
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
        <Field label="Business name">
          <input name="business_name" required className={inputClass} />
        </Field>
        <Field label="Website">
          <input name="website" className={inputClass} placeholder="Optional" />
        </Field>
        <Field label="Industry">
          <input name="industry" required className={inputClass} />
        </Field>
        <Field label="Asset type">
          <select name="asset_type" defaultValue="SaaS" required className={inputClass}>
            {assetTypeOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Asking price range">
          <input name="asking_price_range" required className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Summary">
          <textarea name="summary" required rows={4} className={inputClass} />
        </Field>
        <Field label="Reason for selling">
          <textarea name="reason_for_selling" required rows={4} className={inputClass} />
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
