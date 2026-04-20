import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin-page-header";
import { HistoryFeed } from "@/components/history-feed";
import { PageCard } from "@/components/page-card";
import { TransferCard } from "@/components/transfer-card";
import { TransferWorkflowStatusPill } from "@/components/transfer-workflow-status-pill";
import { TransferWorkflowUpdateForm } from "@/components/transfer-workflow-update-form";
import { getBuyerRecords } from "@/lib/buyer-ops";
import { getBuyerPortalOpportunityById } from "@/lib/buyer-opportunities";
import {
  getContractRecordByTransferRowId,
  getOfferRecordByContractRowId,
  getBuyerOfferSubmissionByOfferRecordId,
  getTransferRecordById,
  updateTransferWorkflowAction,
} from "@/lib/closeout-ops";
import { getTransferHistoryEvents } from "@/lib/history";

export const dynamic = "force-dynamic";

type AdminTransferDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
    error?: string;
  };
}>;

export default async function AdminTransferDetailPage({ params, searchParams }: AdminTransferDetailPageProps) {
  const transfer = await getTransferRecordById(params.id);

  if (!transfer) {
    redirect("/admin/transfers?error=Transfer%20not%20found.");
  }

  const buyerRecords = await getBuyerRecords();
  const linkedContract = await getContractRecordByTransferRowId(transfer.id);
  const linkedOffer = linkedContract ? await getOfferRecordByContractRowId(linkedContract.id) : null;
  const linkedSubmission = linkedOffer ? await getBuyerOfferSubmissionByOfferRecordId(linkedOffer.id) : null;
  const linkedOpportunity = linkedSubmission ? await getBuyerPortalOpportunityById(linkedSubmission.asset_packaging_id) : null;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Transfer Detail"
        description="Admin-managed transfer record linked back to the contract pipeline."
      />

      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Transfer {searchParams.saved === "updated" ? "updated" : "saved"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <PageCard title="Workflow" description="Update the transfer and keep the handoff timeline visible.">
          <TransferCard transfer={transfer} editable buyerOptions={buyerRecords} />
        </PageCard>

        <div className="grid gap-6">
          <PageCard title="Progression" description="Move the transfer through closeout-ready states.">
            <div className="grid gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-2">
                  <TransferWorkflowStatusPill status={transfer.workflow_status} />
                  <div className="text-sm leading-6 text-ink-700">
                    Closeout-ready at: {transfer.closeout_ready_at ? new Date(transfer.closeout_ready_at).toLocaleString() : "Not set"}
                  </div>
                  <div className="text-sm leading-6 text-ink-700">
                    Completed at: {transfer.completed_at ? new Date(transfer.completed_at).toLocaleString() : "Not set"}
                  </div>
                  <div className="text-sm leading-6 text-ink-700">
                    Archived at: {transfer.archived_at ? new Date(transfer.archived_at).toLocaleString() : "Not set"}
                  </div>
                </div>
                <div className="max-w-xs text-sm leading-6 text-ink-600">
                  Use the workflow selector to advance to ready-to-close or completed. Timestamps are stamped on save.
                </div>
              </div>
              <TransferWorkflowUpdateForm
                record={transfer}
                submitLabel="Save progression"
                action={updateTransferWorkflowAction}
                returnTo={`/admin/transfers/${transfer.id}?saved=updated`}
              />
            </div>
          </PageCard>

          <PageCard title="Linked records" description="Follow the chain back to the contract and internal offer.">
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>Workflow status: {transfer.workflow_status.replaceAll("_", " ")}</div>
              <div>Overall status: {transfer.overall_transfer_status.replaceAll("_", " ")}</div>
              <div>Repo status: {transfer.repo_transfer_status.replaceAll("_", " ")}</div>
              <div>Domain status: {transfer.domain_transfer_status.replaceAll("_", " ")}</div>
              <div>Hosting status: {transfer.hosting_transfer_status.replaceAll("_", " ")}</div>
              <div>Admin account status: {transfer.admin_account_transfer_status.replaceAll("_", " ")}</div>
            </div>
            <div className="mt-4 grid gap-3">
              {linkedContract ? (
                <Link
                  href={`/admin/contracts/${linkedContract.id}`}
                  className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
                >
                  Open linked contract
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-ink-500">
                  No linked contract found.
                </div>
              )}
              {linkedOffer ? (
                <Link
                  href={`/admin/offers/${linkedOffer.id}`}
                  className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
                >
                  Open internal offer
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-ink-500">
                  No linked internal offer found.
                </div>
              )}
              {linkedSubmission ? (
                <Link
                  href={`/admin/buyer-offers/${linkedSubmission.id}`}
                  className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
                >
                  Open buyer submission
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-ink-500">
                  No linked buyer submission found.
                </div>
              )}
              {linkedSubmission ? (
                <Link
                  href="/admin/packaging"
                  className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
                >
                  Open packaging desk
                </Link>
              ) : null}
              {linkedOpportunity ? (
                <Link
                  href={`/portal/buyer/opportunities/${linkedSubmission?.asset_packaging_id ?? ""}`}
                  className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
                >
                  Open opportunity view
                </Link>
              ) : null}
              <Link
                href={`/admin/closeout/${transfer.id}`}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open closeout detail
              </Link>
            </div>
          </PageCard>

          <PageCard title="Transfer readiness" description="This view stays admin-only.">
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>Documentation delivery: {transfer.documentation_delivery}</div>
              <div>Support window: {transfer.support_window}</div>
              <div>Next action: {transfer.next_action}</div>
              <div>Closeout ready: {transfer.closeout_ready_at ? new Date(transfer.closeout_ready_at).toLocaleString() : "Not set"}</div>
              <div>Completed: {transfer.completed_at ? new Date(transfer.completed_at).toLocaleString() : "Not set"}</div>
            </div>
          </PageCard>
        </div>
      </div>

      <PageCard title="History" description="Derived transfer activity with safe timestamps and event labels.">
        <HistoryFeed events={await getTransferHistoryEvents("admin", transfer.id)} compact />
      </PageCard>
    </div>
  );
}
