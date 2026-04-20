import { AdminPageHeader } from "@/components/admin-page-header";
import { TransferCard } from "@/components/transfer-card";
import { TransferFormFields } from "@/components/transfer-form-fields";
import { CloseoutSummary } from "@/components/closeout-summary";
import { SectionHeading } from "@/components/section-heading";
import { TransferWorkflowBoard } from "@/components/transfer-workflow-board";
import {
  createTransferRecord,
  getContractRecords,
  getOfferRecords,
  getTransferRecords,
} from "@/lib/closeout-ops";
import { getBuyerRecords } from "@/lib/buyer-ops";

type TransfersPageProps = Readonly<{
  searchParams?: {
    error?: string;
    saved?: string;
  };
}>;

export default async function TransfersPage({ searchParams }: TransfersPageProps) {
  const [buyerRecords, transferRecords, offerRecords, contractRecords] = await Promise.all([
    getBuyerRecords(),
    getTransferRecords(),
    getOfferRecords(),
    getContractRecords(),
  ]);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Transfer Desk"
        description="Handoff shell for repo, domain, hosting, account, and document transfer workflows."
      />
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Transfer {searchParams.saved === "created" ? "created" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="New Transfer"
          title="Capture a transfer record"
          description="Add the handoff details now so repo, domain, hosting, and account transfer status can be tracked cleanly."
        />
        <form action={createTransferRecord} className="grid gap-5">
          <TransferFormFields buyerOptions={buyerRecords} submitLabel="Create transfer" />
        </form>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {transferRecords[0] ? (
          <TransferCard
            transfer={transferRecords[0]}
            editable
            buyerOptions={buyerRecords}
            detailHref={`/admin/transfers/${transferRecords[0].id}`}
          />
        ) : (
          <section className="grid gap-4 rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 p-6 text-sm leading-6 text-ink-600">
            <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
              Transfer Desk
            </div>
            <div className="text-xl font-semibold text-ink-950">No transfers yet</div>
            <p>
              Add rows to the Supabase <code>transfers</code> table to populate this shell.
            </p>
          </section>
        )}
        <CloseoutSummary offers={offerRecords} contracts={contractRecords} transfers={transferRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Transfer Desk Overview"
          title="Repo, domain, hosting, and account handoff readiness"
          description="Designed to make support windows, documentation delivery, and blocked handoff items obvious."
        />
        {transferRecords.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {transferRecords.map((transfer) => (
              <TransferCard
                key={transfer.id}
                transfer={transfer}
                editable
                buyerOptions={buyerRecords}
                detailHref={`/admin/transfers/${transfer.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            No transfer records are loaded yet. Once rows exist in Supabase, the transfer cards
            will appear here automatically.
          </div>
        )}
      </section>

      <TransferWorkflowBoard
        title="Transfer status board"
        description="A view of what is handed off, what is blocked, and what is still in progress."
        records={transferRecords}
        editable
        buyerOptions={buyerRecords}
      />
    </div>
  );
}
