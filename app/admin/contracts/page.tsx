import { AdminPageHeader } from "@/components/admin-page-header";
import { ContractCard } from "@/components/contract-card";
import { ContractFormFields } from "@/components/contract-form-fields";
import { CloseoutSummary } from "@/components/closeout-summary";
import { ContractWorkflowBoard } from "@/components/contract-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import {
  createContractRecord,
  getContractRecords,
  getOfferRecords,
  getTransferRecords,
} from "@/lib/closeout-ops";
import { getBuyerRecords } from "@/lib/buyer-ops";

type ContractsPageProps = Readonly<{
  searchParams?: {
    error?: string;
    saved?: string;
  };
}>;

export default async function ContractsPage({ searchParams }: ContractsPageProps) {
  const [buyerRecords, contractRecords, offerRecords, transferRecords] = await Promise.all([
    getBuyerRecords(),
    getContractRecords(),
    getOfferRecords(),
    getTransferRecords(),
  ]);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Contracts"
        description="Contract workflow shell for tracking sent, signed, and blocked agreements."
      />
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Contract {searchParams.saved === "created" ? "created" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="New Contract"
          title="Capture a contract record"
          description="Add the contract details now so the record can move through draft, sent, signed, or blocked with less rework."
        />
        <form action={createContractRecord} className="grid gap-5">
          <ContractFormFields buyerOptions={buyerRecords} submitLabel="Create contract" />
        </form>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {contractRecords[0] ? (
          <ContractCard
            contract={contractRecords[0]}
            editable
            buyerOptions={buyerRecords}
            detailHref={`/admin/contracts/${contractRecords[0].id}`}
          />
        ) : (
          <section className="grid gap-4 rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 p-6 text-sm leading-6 text-ink-600">
            <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
              Contracts
            </div>
            <div className="text-xl font-semibold text-ink-950">No contracts yet</div>
            <p>
              Add rows to the Supabase <code>contracts</code> table to populate this shell.
            </p>
          </section>
        )}
        <CloseoutSummary offers={offerRecords} contracts={contractRecords} transfers={transferRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Contracts Overview"
          title="What is signed, what is paid, what is blocked"
          description="Designed to surface contract IDs, document state, signature state, payment state, and notes."
        />
        {contractRecords.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {contractRecords.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                editable
                buyerOptions={buyerRecords}
                detailHref={`/admin/contracts/${contract.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            No contract records are loaded yet. Once rows exist in Supabase, the contract cards
            will appear here automatically.
          </div>
        )}
      </section>

      <ContractWorkflowBoard
        title="Contract status board"
        description="A clear view of draft, sent, signed, and blocked contract records."
        records={contractRecords}
        editable
        buyerOptions={buyerRecords}
      />
    </div>
  );
}
