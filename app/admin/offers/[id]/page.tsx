import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { HistoryFeed } from "@/components/history-feed";
import { ContractCard } from "@/components/contract-card";
import { OfferDispositionPill } from "@/components/offer-disposition-pill";
import { OfferCard } from "@/components/offer-card";
import { PageCard } from "@/components/page-card";
import { getBuyerRecords } from "@/lib/buyer-ops";
import {
  advanceOfferToContractAction,
  getBuyerOfferSubmissionByOfferRecordId,
  getContractRecordById,
  getOfferRecordById,
  offerDispositionLabels,
  offerDispositionOrder,
  updateOfferDispositionAction,
} from "@/lib/closeout-ops";
import { getOfferHistoryEvents } from "@/lib/history";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type AdminOfferDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
    error?: string;
  };
}>;

export default async function AdminOfferDetailPage({ params, searchParams }: AdminOfferDetailPageProps) {
  const offer = await getOfferRecordById(params.id);

  if (!offer) {
    redirect("/admin/offers?error=Offer%20not%20found.");
  }

  const buyerRecords = await getBuyerRecords();
  const linkedSubmission = await getBuyerOfferSubmissionByOfferRecordId(offer.id);
  const linkedContract = offer.contract_row_id ? await getContractRecordById(offer.contract_row_id) : null;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Offer Detail"
        description="Internal offer record bridged from the buyer offer review pipeline."
      />

      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Offer {searchParams.saved === "updated" ? "updated" : "saved"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <PageCard title="Internal offer row" description="Editable internal record used by the closeout pipeline.">
        <OfferCard offer={offer} editable buyerOptions={buyerRecords} returnTo={`/admin/offers/${offer.id}?saved=updated`} />
      </PageCard>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Disposition" description="Control the seller response pipeline and contract handoff from here.">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm leading-6 text-ink-700">Current disposition</div>
              <OfferDispositionPill status={offer.disposition_status} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Disposition note" value={offer.disposition_note || "No disposition note set."} />
              <Info
                label="Disposition updated"
                value={offer.disposition_at ? new Date(offer.disposition_at).toLocaleString() : "Not set"}
              />
            </div>

            <form action={updateOfferDispositionAction} className="grid gap-3">
              <input type="hidden" name="id" value={offer.id} />
              <input type="hidden" name="return_to" value={`/admin/offers/${offer.id}?saved=updated`} />
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                  Disposition status
                </span>
                <select name="disposition_status" defaultValue={offer.disposition_status ?? "seller_review"} className={inputClass}>
                  {offerDispositionOrder.map((status) => (
                    <option key={status} value={status}>
                      {offerDispositionLabels[status]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                  Disposition note
                </span>
                <textarea name="disposition_note" defaultValue={offer.disposition_note ?? ""} rows={4} className={inputClass} />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Save disposition
                </button>
              </div>
            </form>

            <form action={advanceOfferToContractAction}>
              <input type="hidden" name="id" value={offer.id} />
              <input type="hidden" name="return_to" value={`/admin/offers/${offer.id}?saved=contracted`} />
              <button
                type="submit"
                className="rounded-full border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-600"
              >
                Advance to contract
              </button>
            </form>
          </div>
        </PageCard>

        <div className="grid gap-6">
          <PageCard title="Links" description="Navigate to related records and the linked submission.">
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
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
              {offer.contract_row_id ? (
                <Link
                  href={linkedContract ? `/admin/contracts/${linkedContract.id}` : "/admin/contracts"}
                  className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
                >
                  {linkedContract ? "Open linked contract" : "Open linked contract desk"}
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-ink-500">
                  No linked contract has been created yet.
                </div>
              )}
            </div>
          </PageCard>

          {linkedContract ? (
            <PageCard title="Linked contract" description="Contract created from this offer.">
              <ContractCard contract={linkedContract} editable buyerOptions={buyerRecords} />
            </PageCard>
          ) : null}
        </div>
      </div>

      <PageCard title="History" description="Derived offer activity with safe timestamps and event labels.">
        <HistoryFeed events={await getOfferHistoryEvents("admin", offer.id)} compact />
      </PageCard>
    </div>
  );
}

function Info({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200";
