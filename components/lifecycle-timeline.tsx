import type { DealLifecycleEvent } from "@/lib/deals";

export function LifecycleTimeline({
  title,
  description,
  events,
}: Readonly<{
  title: string;
  description: string;
  events: DealLifecycleEvent[];
}>) {
  return (
    <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-6 shadow-soft">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-ink-950">{title}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600">{description}</p>
      </div>
      <div className="grid gap-3">
        {events.map((event) => (
          <article key={event.key} className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-ink-950">{event.label}</div>
                <div className="mt-1 text-sm leading-6 text-ink-600">{event.summary}</div>
              </div>
              <span className={badgeClassName(event.state)}>{badgeLabel(event.state)}</span>
            </div>
            <div className="mt-3 text-xs font-medium tracking-[0.18em] text-ink-500 uppercase">
              {event.at ? new Date(event.at).toLocaleString() : event.state === "pending" ? "Not reached" : "Recorded"}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function badgeLabel(state: DealLifecycleEvent["state"]) {
  switch (state) {
    case "complete":
      return "Complete";
    case "blocked":
      return "Blocked";
    case "archived":
      return "Archived";
    case "pending":
    default:
      return "Pending";
  }
}

function badgeClassName(state: DealLifecycleEvent["state"]) {
  const base = "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]";

  switch (state) {
    case "complete":
      return `${base} border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700`;
    case "blocked":
      return `${base} border-rose-200 bg-[rgba(43,13,19,0.96)] text-rose-700`;
    case "archived":
      return `${base} border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800`;
    case "pending":
    default:
      return `${base} border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700`;
  }
}
