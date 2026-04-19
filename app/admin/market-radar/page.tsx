import { AdminPageHeader } from "@/components/admin-page-header";
import { RadarIntakeCard } from "@/components/radar-intake-card";
import { RadarStatusBoard } from "@/components/radar-status-board";
import { RadarIdeaCard } from "@/components/radar-idea-card";
import { RadarScorePill } from "@/components/radar-score-pill";
import { radarRecords } from "@/lib/market-radar";

export default function MarketRadarPage() {
  const topIdeas = radarRecords.filter((record) => record.status === "idea" || record.status === "researching");

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Market Radar"
        description="Internal idea capture and validation shell for niche selection, demand signals, and build prioritization."
      />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <RadarIntakeCard />
        <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Quick Scan
          </div>
          <div className="text-xl font-semibold text-ink-950">What to build next</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <RadarScorePill label="Ideas" value={topIdeas.length} tone="positive" />
            <RadarScorePill label="Approved" value={radarRecords.filter((r) => r.status === "approved").length} tone="neutral" />
            <RadarScorePill label="Rejected" value={radarRecords.filter((r) => r.status === "rejected").length} tone="danger" />
            <RadarScorePill label="Later" value={radarRecords.filter((r) => r.status === "later").length} tone="warning" />
          </div>
          <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
            Structure is ready for internal research summaries later. No AI provider is connected in
            Phase 4.
          </div>
        </section>
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
          Idea Review
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {topIdeas.map((record) => (
            <RadarIdeaCard key={record.id} record={record} />
          ))}
        </div>
      </section>

      <RadarStatusBoard
        title="Idea-to-approval pipeline"
        description="Grouped by status so Allura can quickly see what is being researched, approved, rejected, or held for later."
        records={radarRecords}
      />
    </div>
  );
}
