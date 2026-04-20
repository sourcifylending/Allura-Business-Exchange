import Link from "next/link";
import type { AdminRiskRecord } from "@/lib/portal-monitoring";

export function RiskItemCard({
  record,
  href,
}: Readonly<{
  record: AdminRiskRecord;
  href: string;
}>) {
  return (
    <article className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5 shadow-[0_20px_60px_rgba(22,18,12,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.22em] text-ink-500 uppercase">{record.role_label}</div>
          <h3 className="mt-2 text-lg font-semibold text-ink-950">{record.title}</h3>
          <div className="mt-2 text-sm leading-6 text-ink-700">{record.chain_label}</div>
        </div>
        <div className="rounded-full border border-rust-200 bg-[rgba(120,72,22,0.08)] px-3 py-1 text-xs font-semibold text-rust-700">
          {record.risk_label}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm leading-6 text-ink-700">
        <div>Context: {record.chain_summary}</div>
        <div>Status: {record.status_label}</div>
        <div>Stage: {record.stage_label}</div>
        <div>Next step: {record.next_step_label}</div>
        <div>Last activity: {record.age_label}</div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Open record
        </Link>
        <div className="text-xs text-ink-500">Aging and risk labels are derived from current timestamps.</div>
      </div>
    </article>
  );
}
