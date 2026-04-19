import { RadarScorePill } from "@/components/radar-score-pill";
import type { BusinessUnderwritingRecord } from "@/lib/business-underwriting";

export function UnderwritingSummary({
  records,
}: Readonly<{
  records: BusinessUnderwritingRecord[];
}>) {
  const approved = records.filter((record) => record.overall_underwriting_status === "approved").length;
  const hold = records.filter((record) => record.overall_underwriting_status === "hold").length;
  const risky = records.filter((record) => record.debt_risk === "high" || record.owner_dependence_risk === "high").length;

  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Risk / Strength Snapshot
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <RadarScorePill label="Approved" value={approved} tone="positive" />
        <RadarScorePill label="Hold" value={hold} tone="warning" />
        <RadarScorePill label="High Risk Flags" value={risky} tone="danger" />
      </div>
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
        Deal quality, transferability, debt risk, and owner dependence should be obvious at a
        glance before a deal moves forward.
      </div>
    </section>
  );
}

