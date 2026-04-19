import { SectionHeading } from "@/components/section-heading";
import { TransferCard } from "@/components/transfer-card";
import { transferStatusLabels, type TransferRecord, type TransferStatus } from "@/lib/closeout-ops";

export function TransferWorkflowBoard({
  title,
  description,
  records,
}: Readonly<{
  title: string;
  description: string;
  records: TransferRecord[];
}>) {
  const grouped = records.reduce<Record<TransferStatus, TransferRecord[]>>(
    (acc, transfer) => {
      acc[transfer.overall_transfer_status].push(transfer);
      return acc;
    },
    {
      not_started: [],
      in_progress: [],
      blocked: [],
      complete: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Workflow" title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-4">
        {(Object.keys(transferStatusLabels) as TransferStatus[]).map((status) => (
          <div key={status} className="rounded-[1.5rem] border border-ink-200 bg-ink-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">
                {transferStatusLabels[status]}
              </h3>
              <span className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700">
                {grouped[status].length}
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {grouped[status].map((transfer) => (
                <TransferCard key={transfer.id} transfer={transfer} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

