import Link from "next/link";
import { RequestStatusPill } from "@/components/request-status-pill";
import type { PortalRequestSummaryRecord } from "@/lib/portal-requests";

export function RequestCard({
  record,
  href,
  showAdminLinks = false,
}: Readonly<{
  record: PortalRequestSummaryRecord;
  href: string;
  showAdminLinks?: boolean;
}>) {
  return (
    <article className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
            {record.request_type_label}
          </div>
          <div className="mt-1 text-lg font-semibold text-ink-950">{record.title}</div>
          <div className="mt-1 text-sm leading-6 text-ink-600">
            {record.target_role_label} request · {record.application_label}
          </div>
        </div>
        <RequestStatusPill record={record} />
      </div>

      <p className="text-sm leading-6 text-ink-600">{record.safe_summary}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Due date" value={record.due_date ? new Date(record.due_date).toLocaleDateString() : "Not set"} />
        <Info label="Next step" value={record.safe_next_step} />
        <Info label="Status" value={record.safe_status_label} />
        <Info label="Documents" value={String(record.linked_document_count)} />
      </div>

      {showAdminLinks ? (
        <div className="grid gap-3 rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
          <div>Application: {record.application_summary}</div>
          <div>Chain: {record.chain_label}</div>
          <div>{record.chain_summary}</div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {record.application_href ? <AdminLink href={record.application_href}>Application</AdminLink> : null}
            {record.packaging_href ? <AdminLink href={record.packaging_href}>Deal</AdminLink> : null}
            {record.offer_href ? <AdminLink href={record.offer_href}>Offer</AdminLink> : null}
            {record.contract_href ? <AdminLink href={record.contract_href}>Contract</AdminLink> : null}
            {record.transfer_href ? <AdminLink href={record.transfer_href}>Transfer</AdminLink> : null}
            {record.closeout_href ? <AdminLink href={record.closeout_href}>Closeout</AdminLink> : null}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={href}
          className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Open detail
        </Link>
        <div className="text-sm leading-6 text-ink-600">{record.created_at ? new Date(record.created_at).toLocaleDateString() : "Not set"}</div>
      </div>
    </article>
  );
}

function AdminLink({
  href,
  children,
}: Readonly<{
  href: string;
  children: string;
}>) {
  return (
    <Link
      href={href}
      className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-ink-700 uppercase transition hover:border-accent-300 hover:text-accent-700"
    >
      {children}
    </Link>
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
