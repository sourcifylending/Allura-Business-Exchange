import { RadarScorePill } from "@/components/radar-score-pill";
import type { AssetIntakeRecord } from "@/lib/asset-registry";

export function AssetIntakeSummary({
  records,
}: Readonly<{
  records: AssetIntakeRecord[];
}>) {
  const readyCount = records.filter((record) => record.transfer_checklist_status === "ready").length;
  const draftCount = records.filter((record) => record.documentation_status.includes("draft")).length;
  const riskCount = records.filter((record) => record.risk_flags.length > 0).length;

  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Registry Snapshot
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <RadarScorePill label="Ready" value={readyCount} tone="positive" />
        <RadarScorePill label="Drafts" value={draftCount} tone="neutral" />
        <RadarScorePill label="Risk Flags" value={riskCount} tone="warning" />
      </div>
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
        This registry view is meant to make build readiness and transfer readiness obvious at a
        glance.
      </div>
    </section>
  );
}

