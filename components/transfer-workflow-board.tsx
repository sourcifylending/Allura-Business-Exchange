import { SectionHeading } from "@/components/section-heading";
import { TransferCard } from "@/components/transfer-card";
import {
  transferWorkflowStatusLabels,
  transferWorkflowStatusOrder,
  type BuyerRecord,
  type TransferRecord,
} from "@/lib/closeout-ops";

export function TransferWorkflowBoard({
  title,
  description,
  records,
  editable = false,
  buyerOptions = [],
}: Readonly<{
  title: string;
  description: string;
  records: TransferRecord[];
  editable?: boolean;
  buyerOptions?: BuyerRecord[];
}>) {
  const grouped = records.reduce<Record<(typeof transferWorkflowStatusOrder)[number], TransferRecord[]>>(
    (acc, transfer) => {
      acc[transfer.workflow_status].push(transfer);
      return acc;
    },
    {
      queued: [],
      in_progress: [],
      pending_docs: [],
      pending_admin: [],
      ready_to_close: [],
      completed: [],
      cancelled: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Workflow" title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-4">
        {transferWorkflowStatusOrder.map((status) => (
          <div key={status} className="rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">
                {transferWorkflowStatusLabels[status]}
              </h3>
              <span className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-2.5 py-1 text-xs font-semibold text-ink-700">
                {grouped[status].length}
              </span>
            </div>
            {grouped[status].length > 0 ? (
              <div className="mt-4 grid gap-3">
                {grouped[status].map((transfer) => (
                  <TransferCard
                    key={transfer.id}
                    transfer={transfer}
                    editable={editable}
                    buyerOptions={buyerOptions}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-4 py-5 text-sm leading-6 text-ink-500">
                No records in this stage yet.
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
