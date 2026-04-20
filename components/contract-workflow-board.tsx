import { ContractCard } from "@/components/contract-card";
import { SectionHeading } from "@/components/section-heading";
import {
  contractStatusOrder,
  contractWorkflowStatusLabels,
  normalizeContractStatus,
  type BuyerRecord,
  type ContractRecord,
  type ContractWorkflowStatus,
} from "@/lib/closeout-ops";

export function ContractWorkflowBoard({
  title,
  description,
  records,
  editable = false,
  buyerOptions = [],
}: Readonly<{
  title: string;
  description: string;
  records: ContractRecord[];
  editable?: boolean;
  buyerOptions?: BuyerRecord[];
}>) {
  const grouped = records.reduce<Record<ContractWorkflowStatus, ContractRecord[]>>(
    (acc, contract) => {
      acc[normalizeContractStatus(contract.status)].push(contract);
      return acc;
    },
    {
      draft: [],
      in_review: [],
      awaiting_admin: [],
      ready_for_transfer: [],
      transferred: [],
      closed: [],
      cancelled: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Workflow" title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-4">
        {contractStatusOrder.map((status) => (
          <div key={status} className="rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">
                {contractWorkflowStatusLabels[status]}
              </h3>
              <span className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-2.5 py-1 text-xs font-semibold text-ink-700">
                {grouped[status].length}
              </span>
            </div>
            {grouped[status].length > 0 ? (
              <div className="mt-4 grid gap-3">
                {grouped[status].map((contract) => (
                  <ContractCard key={contract.id} contract={contract} editable={editable} buyerOptions={buyerOptions} />
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
