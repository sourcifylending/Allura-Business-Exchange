import type { ReactNode } from "react";
import type { RadarRecord } from "@/lib/market-radar";
import { radarStatusLabels, radarStatusOrder } from "@/lib/market-radar";

const strengthLevels = ["low", "medium", "high"] as const;

export function RadarIdeaFormFields({
  record,
  submitLabel,
}: Readonly<{
  record?: Partial<RadarRecord>;
  submitLabel: string;
}>) {
  return (
    <>
      <input type="hidden" name="id" value={record?.id ?? ""} />
      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Niche industry">
          <input
            name="niche_industry"
            defaultValue={record?.niche_industry ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Target buyer">
          <input
            name="target_buyer"
            defaultValue={record?.target_buyer ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Urgency of pain">
          <select
            name="urgency_of_pain"
            defaultValue={record?.urgency_of_pain ?? "medium"}
            required
            className={inputClass}
          >
            {strengthLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Competition level">
          <select
            name="competition_level"
            defaultValue={record?.competition_level ?? "medium"}
            required
            className={inputClass}
          >
            {strengthLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Build complexity">
          <select
            name="build_complexity"
            defaultValue={record?.build_complexity ?? "medium"}
            required
            className={inputClass}
          >
            {strengthLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={record?.status ?? "idea"}
            required
            className={inputClass}
          >
            {radarStatusOrder.map((status) => (
              <option key={status} value={status}>
                {radarStatusLabels[status]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Speed to build score">
          <input
            name="speed_to_build_score"
            type="number"
            min={0}
            max={10}
            defaultValue={record?.speed_to_build_score ?? 5}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Speed to sell score">
          <input
            name="speed_to_sell_score"
            type="number"
            min={0}
            max={10}
            defaultValue={record?.speed_to_sell_score ?? 5}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Likely sale price band">
          <input
            name="likely_sale_price_band"
            defaultValue={record?.likely_sale_price_band ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Saleability score">
          <input
            name="saleability_score"
            type="number"
            min={0}
            max={100}
            defaultValue={record?.saleability_score ?? 50}
            required
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Problem statement">
          <textarea
            name="problem_statement"
            defaultValue={record?.problem_statement ?? ""}
            required
            rows={4}
            className={inputClass}
          />
        </Field>
        <Field label="Demand notes">
          <textarea
            name="demand_notes"
            defaultValue={record?.demand_notes ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Reason to build now">
          <textarea
            name="reason_to_build_now"
            defaultValue={record?.reason_to_build_now ?? ""}
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
      <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200";
