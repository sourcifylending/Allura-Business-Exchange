import { AdminPageHeader } from "@/components/admin-page-header";
import { RadarIntakeCard } from "@/components/radar-intake-card";
import { RadarStatusBoard } from "@/components/radar-status-board";
import { RadarIdeaCard } from "@/components/radar-idea-card";
import { RadarScorePill } from "@/components/radar-score-pill";
import { RadarIdeaFormFields } from "@/components/radar-idea-form-fields";
import { createRadarRecord, getRadarRecords, updateRadarRecord } from "@/lib/market-radar";

type MarketRadarPageProps = Readonly<{
  searchParams?: {
    error?: string;
    saved?: string;
  };
}>;

export default async function MarketRadarPage({ searchParams }: MarketRadarPageProps) {
  const radarRecords = await getRadarRecords();
  const topIdeas = radarRecords.filter((record) => record.status === "idea" || record.status === "researching");
  const approvedCount = radarRecords.filter((record) => record.status === "approved").length;
  const rejectedCount = radarRecords.filter((record) => record.status === "rejected").length;
  const laterCount = radarRecords.filter((record) => record.status === "later").length;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Market Radar"
        description="Internal idea capture and validation shell for niche selection, demand signals, and build prioritization."
      />
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Market Radar idea {searchParams.saved === "created" ? "created" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}
      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
          New Idea
        </div>
        <div className="text-xl font-semibold text-ink-950">Capture a fresh market opportunity</div>
        <form action={createRadarRecord} className="grid gap-5">
          <RadarIdeaFormFields submitLabel="Create idea" />
        </form>
      </section>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <RadarIntakeCard />
        <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Quick Scan
          </div>
          <div className="text-xl font-semibold text-ink-950">What to build next</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <RadarScorePill label="Ideas" value={topIdeas.length} tone="positive" />
            <RadarScorePill label="Approved" value={approvedCount} tone="neutral" />
            <RadarScorePill label="Rejected" value={rejectedCount} tone="danger" />
            <RadarScorePill label="Later" value={laterCount} tone="warning" />
          </div>
          <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
            {radarRecords.length === 0
              ? "No market radar ideas are loaded yet. Add rows in Supabase to populate this shell."
              : "Structure is ready for internal research summaries later. No AI provider is connected in Phase 4."}
          </div>
        </section>
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
          Idea Review
        </div>
        {topIdeas.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {topIdeas.map((record) => (
              <RadarIdeaCard key={record.id} record={record} editable />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            No market radar ideas have been loaded yet. Once the Supabase table has rows, the
            highest-priority ideas will appear here automatically.
          </div>
        )}
      </section>

      <RadarStatusBoard
        title="Idea-to-approval pipeline"
        description="Grouped by status so Allura can quickly see what is being researched, approved, rejected, or held for later."
        records={radarRecords}
      />
    </div>
  );
}
