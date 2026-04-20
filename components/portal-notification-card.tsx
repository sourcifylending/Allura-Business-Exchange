import Link from "next/link";
import type { PortalNotificationRecord } from "@/lib/portal-monitoring";

export function PortalNotificationCard({
  record,
  href,
  actionLabel = "Open notification",
}: Readonly<{
  record: PortalNotificationRecord;
  href: string;
  actionLabel?: string;
}>) {
  const kindLabel = record.kind === "request" ? "Request" : "Lifecycle";

  return (
    <article className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5 shadow-[0_20px_60px_rgba(22,18,12,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.22em] text-ink-500 uppercase">{kindLabel}</div>
          <h3 className="mt-2 text-lg font-semibold text-ink-950">{record.title}</h3>
          <div className="mt-2 text-sm leading-6 text-ink-700">{record.chain_label}</div>
        </div>
        <div className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.08)] px-3 py-1 text-xs font-semibold text-accent-700">
          {record.status_label}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm leading-6 text-ink-700">
        <div>Summary: {record.summary}</div>
        <div>Next step: {record.next_step_label}</div>
        <div>Updated: {record.timestamp_label}</div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          {actionLabel}
        </Link>
        <div className="text-xs text-ink-500">This is a safe summary, not a message thread.</div>
      </div>
    </article>
  );
}
