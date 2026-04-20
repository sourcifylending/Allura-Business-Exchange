import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin-page-header";
import { HistoryFeed } from "@/components/history-feed";
import { ContractCard } from "@/components/contract-card";
import { PageCard } from "@/components/page-card";
import { TransferCard } from "@/components/transfer-card";
import { getBuyerRecords } from "@/lib/buyer-ops";
import { getBuyerPortalOpportunityById } from "@/lib/buyer-opportunities";
import {
  advanceContractToTransferAction,
  getBuyerOfferSubmissionByOfferRecordId,
  getContractRecordById,
  getOfferRecordByContractRowId,
  getTransferRecordById,
} from "@/lib/closeout-ops";
import { getContractHistoryEvents } from "@/lib/history";

export const dynamic = "force-dynamic";

type AdminContractDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
    error?: string;
  };
}>;

export default async function AdminContractDetailPage({ params, searchParams }: AdminContractDetailPageProps) {
  const contract = await getContractRecordById(params.id);

  if (!contract) {
    redirect("/admin/contracts?error=Contract%20not%20found.");
  }

  const buyerRecords = await getBuyerRecords();
  const linkedOffer = await getOfferRecordByContractRowId(contract.id);
  const linkedSubmission = linkedOffer ? await getBuyerOfferSubmissionByOfferRecordId(linkedOffer.id) : null;
  const linkedTransfer = contract.transfer_row_id ? await getTransferRecordById(contract.transfer_row_id) : null;
  const linkedOpportunity = linkedSubmission
    ? await getBuyerPortalOpportunityById(linkedSubmission.asset_packaging_id)
    : null;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Contract Detail"
        description="Admin-managed contract progression with links back to the offer, opportunity, and transfer chain."
      />

      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Contract {searchParams.saved === "updated" ? "updated" : "saved"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <PageCard title="Workflow" description="Update the contract and advance it into transfer readiness.">
          <div className="grid gap-4">
            <ContractCard contract={contract} editable buyerOptions={buyerRecords} />

            <div className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5">
              <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                Transfer readiness
              </div>
              <p className="mt-2 text-sm leading-6 text-ink-700">
                Use this action when the contract is ready to move into the transfer desk.
              </p>
              <form action={advanceContractToTransferAction} className="mt-4 grid gap-3">
                <input type="hidden" name="id" value={contract.id} />
                <input type="hidden" name="return_to" value={`/admin/contracts/${contract.id}?saved=updated`} />
                <button
                  type="submit"
                  disabled={Boolean(contract.transfer_row_id)}
                  className="rounded-full border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {contract.transfer_row_id ? "Transfer already linked" : "Advance to transfer"}
                </button>
              </form>
            </div>
          </div>
        </PageCard>

        <div className="grid gap-6">
          <PageCard title="Linked records" description="Follow the chain back to the offer, opportunity, and transfer.">
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>Contract status: {contract.status.replaceAll("_", " ")}</div>
              <div>Sent date: {contract.sent_date}</div>
              <div>Document status: {contract.document_status}</div>
              <div>Transfer linked: {contract.transfer_row_id ? "Yes" : "No"}</div>
            </div>
            <div className="mt-4 grid gap-3">
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
                linkedOpportunity ? (
                  <Link
                    href={`/portal/buyer/opportunities/${linkedSubmission.asset_packaging_id}`}
                    className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
                  >
                    Open opportunity
                  </Link>
                ) : (
                  <div className="rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-ink-500">
                    Opportunity metadata is not available.
                  </div>
                )
              ) : null}
              {linkedTransfer ? (
                <Link
                  href={`/admin/transfers/${linkedTransfer.id}`}
                  className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
                >
                  Open transfer record
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-ink-500">
                  No transfer record is linked yet.
                </div>
              )}
            </div>
          </PageCard>

          {linkedOffer ? (
            <PageCard title="Linked internal offer" description="The contract was promoted from this offer record.">
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>Offer amount: {linkedOffer.offer_amount}</div>
                <div>Disposition: {linkedOffer.disposition_status ?? "Not set"}</div>
                <div>Next action: {linkedOffer.next_action}</div>
              </div>
            </PageCard>
          ) : null}

          {linkedTransfer ? (
            <PageCard title="Transfer detail" description="The linked transfer record remains admin-managed.">
              <TransferCard transfer={linkedTransfer} editable buyerOptions={buyerRecords} />
            </PageCard>
          ) : null}
        </div>
      </div>

      <PageCard title="History" description="Derived contract activity with safe timestamps and event labels.">
        <HistoryFeed events={await getContractHistoryEvents("admin", contract.id)} compact />
      </PageCard>
    </div>
  );
}
