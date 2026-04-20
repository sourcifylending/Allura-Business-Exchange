import Link from "next/link";
import type { PortalContractRecord } from "@/lib/portal-contracts";
import { portalContractNextStepLabel, portalContractStatusLabel } from "@/lib/portal-contracts";

const statusStyles: Record<PortalContractRecord["portal_status"], string> = {
  draft: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  in_review: "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  awaiting_admin: "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  ready_for_transfer: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  transferred: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  closed: "border-rose-200 bg-[rgba(43,13,19,0.96)] text-rose-700",
  cancelled: "border-rose-200 bg-[rgba(43,13,19,0.96)] text-rose-700",
};

export function PortalContractCard({
  record,
  href,
  transferHref,
}: Readonly<{
  record: PortalContractRecord;
  href: string;
  transferHref?: string;
}>) {
  return (
    <article className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
            {record.contract_type}
          </div>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink-950">{record.asset_name}</h3>
          <div className="mt-1 text-sm text-ink-600">Contract record {record.contract_record_id}</div>
        </div>
        <span
          className={[
            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            statusStyles[record.portal_status],
          ].join(" ")}
        >
          {portalContractStatusLabel(record)}
        </span>
      </div>

      <p className="text-sm leading-6 text-ink-600">{portalContractNextStepLabel(record)}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Document status" value={record.document_status} />
        <Info label="Sent date" value={new Date(record.sent_date).toLocaleDateString()} />
        <Info
          label="Transfer status"
          value={record.transfer_status ? record.transfer_status.replaceAll("_", " ") : "Not linked"}
        />
        <Info label="Updated" value={new Date(record.contract_updated_at).toLocaleDateString()} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Open contract
        </Link>
        {transferHref ? (
          <Link
            href={transferHref}
            className="inline-flex items-center justify-center rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
          >
            Open transfer
          </Link>
        ) : null}
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
