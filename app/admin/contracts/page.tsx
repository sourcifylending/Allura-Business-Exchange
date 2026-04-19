import { AdminPageHeader } from "@/components/admin-page-header";
import { CloseoutSummary } from "@/components/closeout-summary";
import { ContractWorkflowBoard } from "@/components/contract-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { contractRecords, offerRecords, transferRecords } from "@/lib/closeout-ops";

export default function ContractsPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Contracts"
        description="Contract workflow shell for tracking sent, signed, and blocked agreements."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ContractWorkflowBoard
          title="Contract status board"
          description="A clear view of draft, sent, signed, and blocked contract records."
          records={contractRecords}
        />
        <CloseoutSummary offers={offerRecords} contracts={contractRecords} transfers={transferRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Contracts Overview"
          title="What is signed, what is paid, what is blocked"
          description="Designed to surface contract IDs, document state, signature state, payment state, and notes."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {contractRecords.map((contract) => (
            <div key={contract.id} className="rounded-[1.75rem] border border-ink-200 bg-ink-50 p-6">
              <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
                {contract.contract_record_id}
              </div>
              <div className="mt-3 text-sm leading-6 text-ink-700">{contract.asset_name}</div>
              <div className="mt-3 text-sm leading-6 text-ink-600">{contract.buyer_name}</div>
              <div className="mt-3 text-sm leading-6 text-ink-600">{contract.notes}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
