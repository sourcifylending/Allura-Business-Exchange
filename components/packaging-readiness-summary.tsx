import { RadarScorePill } from "@/components/radar-score-pill";
import type { PackagingRecord } from "@/lib/packaging";
import { packagingStatusLabels } from "@/lib/packaging";

export function PackagingReadinessSummary({
  records,
}: Readonly<{
  records: PackagingRecord[];
}>) {
  const complete = records.filter((record) => record.status === "approved_for_listing").length;
  const draftReady = records.filter((record) => record.status === "draft_ready").length;
  const incomplete = records.filter((record) => record.status === "incomplete").length;

  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Readiness Snapshot
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <RadarScorePill label="Approved" value={complete} tone="positive" />
        <RadarScorePill label="Draft Ready" value={draftReady} tone="warning" />
        <RadarScorePill label="Incomplete" value={incomplete} tone="neutral" />
      </div>
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
        {packagingStatusLabels.approved_for_listing} is the target state before an asset can flow
        into listings, offers, and transfer.
      </div>
    </section>
  );
}

