import Link from "next/link";
import { dealLifecycleStageLabel, type DealLifecycleRecord } from "@/lib/deals";

export function DealLifecycleCard({
  record,
  href,
}: Readonly<{
  record: DealLifecycleRecord;
  href: string;
}>) {
  return (
    <article className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">Deal Lifecycle</div>
          <div className="mt-1 text-lg font-semibold text-ink-950">{record.asset_name}</div>
          <div className="mt-1 text-sm leading-6 text-ink-600">{record.portal_summary}</div>
        </div>
        <div className="grid justify-items-end gap-2">
          <Badge tone="border-ink-200 bg-[rgb(var(--surface))] text-ink-700">{dealLifecycleStageLabel(record.stage)}</Badge>
          <Badge
            tone={
              record.is_archived
                ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
                : record.is_completed
                  ? "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700"
                  : "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700"
            }
          >
            {record.current_status_label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Buyer status" value={record.buyer_status_label} />
        <Info label="Seller status" value={record.seller_status_label} />
        <Info label="Current workflow" value={record.workflow_status.replaceAll("_", " ")} />
        <Info label="Last meaningful" value={record.last_meaningful_at ? new Date(record.last_meaningful_at).toLocaleString() : "Not yet"} />
        <Info label="Contract" value={record.has_contract ? "Linked" : "Not linked"} />
        <Info label="Transfer" value={record.has_transfer ? (record.is_archived ? "Archived" : "Linked") : "Not linked"} />
      </div>

      <div className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
        {record.current_summary}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={href}
          className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Open detail
        </Link>
      </div>
    </article>
  );
}

function Info({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

function Badge({
  tone,
  children,
}: Readonly<{
  tone: string;
  children: string;
}>) {
  return (
    <span className={["inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase", tone].join(" ")}>
      {children}
    </span>
  );
}
