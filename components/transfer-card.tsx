import { TransferStatusPill } from "@/components/transfer-status-pill";
import type { TransferRecord } from "@/lib/closeout-ops";

export function TransferCard({
  transfer,
}: Readonly<{
  transfer: TransferRecord;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Transfer Desk
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{transfer.asset_name}</h3>
          <div className="mt-1 text-sm text-ink-600">{transfer.buyer_name}</div>
        </div>
        <TransferStatusPill status={transfer.overall_transfer_status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Repo transfer" value={transfer.repo_transfer_status} />
        <Detail label="Domain transfer" value={transfer.domain_transfer_status} />
        <Detail label="Hosting transfer" value={transfer.hosting_transfer_status} />
        <Detail label="Admin/account transfer" value={transfer.admin_account_transfer_status} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4 sm:grid-cols-2">
        <Detail label="Documentation delivery" value={transfer.documentation_delivery} />
        <Detail label="Support window" value={transfer.support_window} />
        <Detail label="Next action" value={transfer.next_action} />
      </div>
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
    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

