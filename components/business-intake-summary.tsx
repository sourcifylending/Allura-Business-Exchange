import { RadarScorePill } from "@/components/radar-score-pill";
import type { BusinessIntakeRecord } from "@/lib/business-intake";

export function BusinessIntakeSummary({
  records,
}: Readonly<{
  records: BusinessIntakeRecord[];
}>) {
  const complete = records.filter((record) => record.intake_status === "complete").length;
  const redFlags = records.filter((record) => record.review_status === "red_flags").length;
  const needsInfo = records.filter((record) => record.intake_status === "needs_info").length;

  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Intake Snapshot
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <RadarScorePill label="Complete" value={complete} tone="positive" />
        <RadarScorePill label="Needs Info" value={needsInfo} tone="warning" />
        <RadarScorePill label="Red Flags" value={redFlags} tone="danger" />
      </div>
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
        This shell is designed to make completeness, transferability, and red flags easy to scan
        before underwriting.
      </div>
    </section>
  );
}

