import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin-page-header";
import { CloseoutArchiveForm } from "@/components/closeout-archive-form";
import { CloseoutMilestones } from "@/components/closeout-milestones";
import { HistoryFeed } from "@/components/history-feed";
import { PageCard } from "@/components/page-card";
import { TransferCard } from "@/components/transfer-card";
import { TransferWorkflowStatusPill } from "@/components/transfer-workflow-status-pill";
import { TransferWorkflowUpdateForm } from "@/components/transfer-workflow-update-form";
import {
  getBuyerOfferSubmissionByOfferRecordId,
  getContractRecordByTransferRowId,
  getOfferRecordByContractRowId,
  getTransferRecordById,
  updateTransferWorkflowAction,
  transferCloseoutSummary,
} from "@/lib/closeout-ops";
import { getBuyerPortalOpportunityById } from "@/lib/buyer-opportunities";
import { getTransferHistoryEvents } from "@/lib/history";

export const dynamic = "force-dynamic";

type AdminCloseoutDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
    error?: string;
  };
}>;

export default async function AdminCloseoutDetailPage({ params, searchParams }: AdminCloseoutDetailPageProps) {
  const transfer = await getTransferRecordById(params.id);

  if (!transfer) {
    redirect("/admin/closeout?error=Transfer%20not%20found.");
  }

  const linkedContract = await getContractRecordByTransferRowId(transfer.id);
  const linkedOffer = linkedContract ? await getOfferRecordByContractRowId(linkedContract.id) : null;
  const linkedSubmission = linkedOffer ? await getBuyerOfferSubmissionByOfferRecordId(linkedOffer.id) : null;
  const linkedOpportunity = linkedSubmission ? await getBuyerPortalOpportunityById(linkedSubmission.asset_packaging_id) : null;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Closeout Detail"
        description="Admin-managed closeout workflow backed by the transfer record."
      />

      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Closeout {searchParams.saved === "updated" ? "updated" : "saved"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PageCard title="Closeout workflow" description="Update the transfer progression and internal notes.">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-2">
                <TransferWorkflowStatusPill status={transfer.workflow_status} />
                <div className="text-sm leading-6 text-ink-700">{transferCloseoutSummary(transfer)}</div>
                <div className="text-sm leading-6 text-ink-600">
                  Archived: {transfer.archived_at ? new Date(transfer.archived_at).toLocaleString() : "Not yet"}
                </div>
              </div>
              <Link
                href={`/admin/transfers/${transfer.id}`}
                className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open transfer desk
              </Link>
            </div>

            <TransferWorkflowUpdateForm
              record={transfer}
              submitLabel="Save closeout"
              action={updateTransferWorkflowAction}
              returnTo={`/admin/closeout/${transfer.id}?saved=updated`}
            />
          </div>
        </PageCard>

        <PageCard title="Closeout milestones" description="Checklist-style visibility for completion readiness.">
          <CloseoutMilestones transfer={transfer} />
        </PageCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <PageCard title="Linked records" description="Follow the chain back to offer, contract, and packaging.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Transfer record: {transfer.id}</div>
            <div>Workflow status: {transfer.workflow_status.replaceAll("_", " ")}</div>
            <div>Overall status: {transfer.overall_transfer_status.replaceAll("_", " ")}</div>
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
            {linkedOpportunity ? (
              <Link
                href={`/portal/buyer/opportunities/${linkedSubmission?.asset_packaging_id ?? ""}`}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open opportunity view
              </Link>
            ) : null}
          </div>
        </PageCard>

        <PageCard title="Archive" description="Archive completed transfers after closeout is confirmed.">
          <CloseoutArchiveForm transfer={transfer} returnTo={`/admin/closeout/${transfer.id}?saved=updated`} />
        </PageCard>
      </div>

      <PageCard title="Transfer snapshot" description="A compact readout of the transfer record.">
        <TransferCard transfer={transfer} />
      </PageCard>

      <PageCard title="History" description="Derived closeout activity with safe timestamps and event labels.">
        <HistoryFeed events={await getTransferHistoryEvents("admin", transfer.id)} compact />
      </PageCard>
    </div>
  );
}
