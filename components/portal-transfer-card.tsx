import Link from "next/link";
import type { PortalTransferRecord } from "@/lib/portal-transfers";
import { portalTransferNextStepLabel } from "@/lib/portal-transfers";
import { PortalTransferStatusPill } from "@/components/portal-transfer-status-pill";

export function PortalTransferCard({
  record,
  href,
}: Readonly<{
  record: PortalTransferRecord;
  href: string;
}>) {
  return (
    <article className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">Transfer</div>
          <div className="mt-1 text-lg font-semibold text-ink-950">{record.asset_name}</div>
          <div className="mt-1 text-sm leading-6 text-ink-600">Contract {record.contract_record_id}</div>
        </div>
        <PortalTransferStatusPill record={record} />
      </div>

      <p className="text-sm leading-6 text-ink-600">{portalTransferNextStepLabel(record)}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Transfer status" value={record.status_label} />
        <Info label="Target close" value={record.target_close_date ? new Date(record.target_close_date).toLocaleDateString() : "Not set"} />
        <Info label="Documentation" value={record.documentation_delivery} />
        <Info label="Support window" value={record.support_window} />
        <Info
          label="Ready"
          value={record.closeout_ready_at ? new Date(record.closeout_ready_at).toLocaleDateString() : "Not yet"}
        />
        <Info
          label="Completed"
          value={record.completed_at ? new Date(record.completed_at).toLocaleDateString() : "Not yet"}
        />
      </div>

      <div className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
        {record.progress_summary}
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
