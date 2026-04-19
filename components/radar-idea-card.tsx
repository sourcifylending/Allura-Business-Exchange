import type { RadarRecord } from "@/lib/market-radar";
import { RadarScorePill } from "@/components/radar-score-pill";

export function RadarIdeaCard({
  record,
}: Readonly<{
  record: RadarRecord;
}>) {
  const statusTone =
    record.status === "approved"
      ? "positive"
      : record.status === "rejected"
        ? "danger"
        : record.status === "later"
          ? "warning"
          : "neutral";

  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
            {record.niche_industry}
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{record.problem_statement}</h3>
        </div>
        <div className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-ink-700 uppercase">
          {record.status}
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-600">{record.reason_to_build_now}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RadarScorePill
          label="Urgency"
          value={record.urgency_of_pain}
          tone={record.urgency_of_pain === "high" ? "positive" : "neutral"}
        />
        <RadarScorePill
          label="Saleability"
          value={record.saleability_score}
          tone={record.saleability_score >= 80 ? "positive" : record.saleability_score >= 55 ? "warning" : "danger"}
        />
        <RadarScorePill
          label="Build Speed"
          value={record.speed_to_build_score}
          tone={record.speed_to_build_score >= 8 ? "positive" : "neutral"}
        />
        <RadarScorePill label="Status" value={record.status} tone={statusTone} />
      </div>
    </article>
  );
}

