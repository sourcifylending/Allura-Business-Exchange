import Link from "next/link";
import { historyEntityTypeLabels, historyEventTypeLabels, historyRoleLabels, type HistoryEvent } from "@/lib/history";

export function HistoryFeed({
  events,
  actionLabel = "Open detail",
  emptyTitle = "No history yet",
  emptyDescription = "History appears once the chain records meaningful activity.",
  compact = false,
}: Readonly<{
  events: HistoryEvent[];
  actionLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  compact?: boolean;
}>) {
  if (events.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] p-5">
        <div className="text-sm font-semibold text-ink-900">{emptyTitle}</div>
        <div className="mt-1 text-sm leading-6 text-ink-600">{emptyDescription}</div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {events.map((event) => (
        <article
          key={event.key}
          className={[
            "rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4",
            compact ? "shadow-none" : "shadow-[0_20px_60px_rgba(22,18,12,0.04)]",
          ].join(" ")}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.22em] text-ink-500 uppercase">
                {historyEntityTypeLabels[event.entity_type]} · {historyRoleLabels[event.role_scope]}
              </div>
              <h3 className="mt-2 text-base font-semibold text-ink-950">{event.label}</h3>
              <div className="mt-1 text-sm leading-6 text-ink-700">{event.summary}</div>
            </div>
            <div className="grid justify-items-end gap-2">
              <span className="rounded-full border border-ink-200 bg-[rgba(18,20,23,0.04)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700">
                {historyEventTypeLabels[event.event_type]}
              </span>
              {event.is_archived ? (
                <span className="rounded-full border border-accent-200 bg-[rgb(var(--accent-soft))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-800">
                  Archived
                </span>
              ) : event.is_completed ? (
                <span className="rounded-full border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Complete
                </span>
              ) : event.is_overdue ? (
                <span className="rounded-full border border-rose-200 bg-[rgba(43,13,19,0.96)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
                  Overdue
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-medium tracking-[0.16em] text-ink-500 uppercase">
            <div>{event.timestamp_label}</div>
            <div>{event.source_label}</div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href={event.href}
              className="inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
            >
              {actionLabel}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
