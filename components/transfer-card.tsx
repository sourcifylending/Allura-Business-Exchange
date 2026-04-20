import Link from "next/link";
import { TransferFormFields } from "@/components/transfer-form-fields";
import { TransferWorkflowStatusPill } from "@/components/transfer-workflow-status-pill";
import { type BuyerRecord, type TransferRecord, transferArchiveStatusLabel, updateTransferRecord } from "@/lib/closeout-ops";

export function TransferCard({
  transfer,
  editable = false,
  buyerOptions = [],
  detailHref,
}: Readonly<{
  transfer: TransferRecord;
  editable?: boolean;
  buyerOptions?: BuyerRecord[];
  detailHref?: string;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">Transfer Desk</div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{transfer.asset_name}</h3>
          <div className="mt-1 text-sm text-ink-600">{transfer.buyer_name}</div>
        </div>
        <div className="grid justify-items-end gap-2">
          <TransferWorkflowStatusPill status={transfer.workflow_status} />
          {detailHref ? (
            <Link
              href={detailHref}
              className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
            >
              Open detail
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Repo transfer" value={transfer.repo_transfer_status} />
        <Detail label="Domain transfer" value={transfer.domain_transfer_status} />
        <Detail label="Hosting transfer" value={transfer.hosting_transfer_status} />
        <Detail label="Admin/account transfer" value={transfer.admin_account_transfer_status} />
        <Detail label="Workflow status" value={transfer.workflow_status.replaceAll("_", " ")} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] p-4 sm:grid-cols-2">
        <Detail label="Documentation delivery" value={transfer.documentation_delivery} />
        <Detail label="Support window" value={transfer.support_window} />
        <Detail label="Next action" value={transfer.next_action} />
        <Detail
          label="Closeout ready"
          value={transfer.closeout_ready_at ? new Date(transfer.closeout_ready_at).toLocaleDateString() : "Not yet"}
        />
        <Detail
          label="Completed"
          value={transfer.completed_at ? new Date(transfer.completed_at).toLocaleDateString() : "Not yet"}
        />
        <Detail label="Archive status" value={transferArchiveStatusLabel(transfer)} />
      </div>

      {editable ? (
        <details className="mt-5 rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] p-4">
          <summary className="cursor-pointer text-sm font-semibold tracking-[0.16em] text-accent-700 uppercase">
            Edit transfer
          </summary>
          <form action={updateTransferRecord} className="mt-5 grid gap-5">
            <TransferFormFields record={transfer} buyerOptions={buyerOptions} submitLabel="Save transfer" />
          </form>
        </details>
      ) : null}
    </article>
  );
}

function Detail({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}
