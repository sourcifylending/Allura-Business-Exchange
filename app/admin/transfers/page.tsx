import { AdminPageHeader } from "@/components/admin-page-header";
import { CloseoutSummary } from "@/components/closeout-summary";
import { SectionHeading } from "@/components/section-heading";
import { TransferWorkflowBoard } from "@/components/transfer-workflow-board";
import { contractRecords, offerRecords, transferRecords } from "@/lib/closeout-ops";

export default function TransfersPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Transfer Desk"
        description="Handoff shell for repo, domain, hosting, account, and document transfer workflows."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <TransferWorkflowBoard
          title="Transfer status board"
          description="A view of what is handed off, what is blocked, and what is still in progress."
          records={transferRecords}
        />
        <CloseoutSummary offers={offerRecords} contracts={contractRecords} transfers={transferRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Transfer Desk Overview"
          title="Repo, domain, hosting, and account handoff readiness"
          description="Designed to make support windows, documentation delivery, and blocked handoff items obvious."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {transferRecords.map((transfer) => (
            <div key={transfer.id} className="rounded-[1.75rem] border border-ink-200 bg-ink-50 p-6">
              <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
                {transfer.asset_name}
              </div>
              <div className="mt-3 text-sm leading-6 text-ink-700">{transfer.buyer_name}</div>
              <div className="mt-3 text-sm leading-6 text-ink-600">{transfer.next_action}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
