import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { TransferCard } from "@/components/transfer-card";
import { getArchivedTransferRecords, getCloseoutDeskTransferRecords, transferCloseoutSummary } from "@/lib/closeout-ops";

export const dynamic = "force-dynamic";

export default async function AdminCloseoutPage() {
  const [deskTransfers, archivedTransfers] = await Promise.all([getCloseoutDeskTransferRecords(), getArchivedTransferRecords()]);

  const readyCount = deskTransfers.filter((transfer) => transfer.workflow_status === "ready_to_close").length;
  const completedCount = deskTransfers.filter((transfer) => transfer.workflow_status === "completed" || transfer.completed_at).length;
  const blockedCount = deskTransfers.filter(
    (transfer) => transfer.workflow_status === "pending_docs" || transfer.workflow_status === "pending_admin" || transfer.workflow_status === "cancelled",
  ).length;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Closeout Desk"
        description="Admin-managed closeout queue for transfers approaching completion and archive."
      />

      <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-6 shadow-soft">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Ready to close" value={String(readyCount)} />
          <Metric label="Completed in desk" value={String(completedCount)} />
          <Metric label="Blocked / pending" value={String(blockedCount)} />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-600">
          <span>Archive queue: {archivedTransfers.length}</span>
          <Link href="/admin/closeout/archive" className="font-semibold text-accent-700 transition hover:text-accent-600">
            Open archive
          </Link>
        </div>
      </section>

      <PageCard title="Closeout queue" description="Transfers moving through closeout, completion, or blockers.">
        {deskTransfers.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {deskTransfers.map((transfer) => (
              <TransferCard
                key={transfer.id}
                transfer={transfer}
                detailHref={`/admin/closeout/${transfer.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
            No closeout-ready transfers are loaded yet.
          </div>
        )}
      </PageCard>

      <PageCard title="Closeout context" description="What the desk is meant to surface.">
        <div className="grid gap-3 text-sm leading-6 text-ink-700">
          <div>Transfer status, contract chain, and archive readiness</div>
          <div>Sanitized progress summaries only</div>
          <div>Admin review before archive or completion</div>
        </div>
        {deskTransfers[0] ? <div className="mt-4 rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">{transferCloseoutSummary(deskTransfers[0])}</div> : null}
      </PageCard>
    </div>
  );
}

function Metric({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink-950">{value}</div>
    </div>
  );
}
