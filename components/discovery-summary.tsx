import { RadarScorePill } from "@/components/radar-score-pill";
import type { DiscoveryRecord } from "@/lib/buyer-discovery";

export function DiscoverySummary({
  records,
}: Readonly<{
  records: DiscoveryRecord[];
}>) {
  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Discovery Snapshot
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <RadarScorePill label="Assets" value={records.length} tone="positive" />
        <RadarScorePill label="Channels" value={records[0]?.recommended_promotion_channels.length ?? 0} tone="warning" />
        <RadarScorePill label="Segments" value={records[0]?.top_target_company_ideas.length ?? 0} tone="neutral" />
      </div>
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
        This shell is organized to support later listings, inquiries, and offer routing without
        adding scraping or automation.
      </div>
    </section>
  );
}

