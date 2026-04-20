import { RadarScorePill } from "@/components/radar-score-pill";

export function RadarIntakeCard() {
  return (
    <section className="rounded-[1.75rem] border border-accent-200 bg-[rgb(var(--accent-soft))] p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Idea Intake
      </div>
      <div className="mt-2 text-2xl font-semibold text-ink-950">Capture, score, and decide fast</div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
        This shell is designed for internal idea capture and fast triage before anything moves into
        a build queue. It now reads from Supabase-backed market radar records and stays clean when
        no rows exist yet.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RadarScorePill label="Input" value="Niche + problem" tone="positive" />
        <RadarScorePill label="Decision" value="Build / Hold / Reject" tone="neutral" />
        <RadarScorePill label="Focus" value="AI asset first" tone="positive" />
        <RadarScorePill label="Output" value="Ready to act" tone="warning" />
      </div>
    </section>
  );
}
