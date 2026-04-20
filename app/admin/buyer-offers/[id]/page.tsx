import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { HistoryFeed } from "@/components/history-feed";
import { PageCard } from "@/components/page-card";
import { OfferDispositionPill } from "@/components/offer-disposition-pill";
import { BuyerOfferStatusPill } from "@/components/buyer-offer-status-pill";
import {
  buyerOfferSubmissionStatusOrder,
  buyerOfferStatusLabels,
  getAdminBuyerOfferSubmissionById,
  promoteBuyerOfferSubmissionAction,
  updateBuyerOfferSubmissionStatusAction,
} from "@/lib/buyer-offers";
import { getOfferRecordById } from "@/lib/closeout-ops";
import { getBuyerRecords } from "@/lib/buyer-ops";
import { getBuyerOfferSubmissionHistoryEvents } from "@/lib/history";
import { OfferCard } from "@/components/offer-card";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type AdminBuyerOfferDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
    error?: string;
  };
}>;

export default async function AdminBuyerOfferDetailPage({ params, searchParams }: AdminBuyerOfferDetailPageProps) {
  const record = await getAdminBuyerOfferSubmissionById(params.id);

  if (!record) {
    redirect("/admin/buyer-offers?error=Submission%20not%20found.");
  }

  const internalOffer = record.offer_record_id ? await getOfferRecordById(record.offer_record_id) : null;
  const buyerRecords = await getBuyerRecords();

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Buyer Offer Detail"
        description="Review a buyer-submitted offer, update its status, and promote it into the internal offer pipeline when ready."
      />

      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Buyer offer {searchParams.saved === "promoted" ? "promoted" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Submission details" description="Buyer offer submission data with no seller contact exposure.">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
                  {record.buyer_name}
                </div>
                <div className="mt-1 text-sm leading-6 text-ink-600">{record.buyer_email}</div>
              </div>
              <div className="grid justify-items-end gap-2">
                <BuyerOfferStatusPill status={record.status} />
                <OfferDispositionPill status={record.offer_disposition_status} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Info label="Opportunity" value={record.asset_name} />
              <Info label="Proposed price" value={record.proposed_price} />
              <Info label="Structure" value={record.structure_preference} />
              <Info label="Financing" value={record.financing_plan} />
              <Info label="Target close date" value={new Date(record.target_close_date).toLocaleDateString()} />
              <Info label="Created" value={new Date(record.created_at).toLocaleDateString()} />
            </div>

            <div className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
              <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Buyer notes</div>
              <div className="mt-2 whitespace-pre-line">{record.notes}</div>
            </div>

            <div className="grid gap-3">
              <form action={updateBuyerOfferSubmissionStatusAction} className="grid gap-3">
                <input type="hidden" name="id" value={record.id} />
                <input type="hidden" name="return_to" value={`/admin/buyer-offers/${record.id}?saved=updated`} />
                <label className="grid gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                    Admin status
                  </span>
                  <select name="status" defaultValue={record.status} className={inputClass}>
                    {buyerOfferSubmissionStatusOrder().map((status) => (
                      <option key={status} value={status}>
                        {buyerOfferStatusLabels[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                    Admin notes
                  </span>
                  <textarea name="admin_notes" defaultValue={record.admin_notes} rows={5} className={inputClass} />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                  >
                    Save review
                  </button>
                </div>
              </form>

              <form action={promoteBuyerOfferSubmissionAction}>
                <input type="hidden" name="id" value={record.id} />
                <input type="hidden" name="return_to" value={`/admin/buyer-offers/${record.id}?saved=promoted`} />
                <button
                  type="submit"
                  className="rounded-full border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-600"
                >
                  Promote to internal offer
                </button>
              </form>
            </div>
          </div>
        </PageCard>

        <div className="grid gap-6">
          <PageCard title="Links" description="Navigate to the related records and internal handoff.">
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <Link
                href={`/portal/buyer/opportunities/${record.asset_packaging_id}`}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open buyer opportunity
              </Link>
              <Link
                href={`/admin/applications/buyers/${record.buyer_application_id}`}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open buyer application
              </Link>
              {record.offer_record_id ? (
                <Link
                  href={`/admin/offers/${record.offer_record_id}`}
                  className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
                >
                  Open internal offer row
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-ink-500">
                  No internal offer row has been created yet.
                </div>
              )}
            </div>
          </PageCard>

          {internalOffer ? (
            <PageCard title="Internal offer row" description="The bridged internal offer record created from this submission.">
              <OfferCard
                offer={internalOffer}
                editable
                buyerOptions={buyerRecords}
                returnTo={`/admin/offers/${internalOffer.id}?saved=updated`}
              />
            </PageCard>
          ) : null}
        </div>
      </div>

      <PageCard title="History" description="Derived offer submission activity with safe timestamps and event labels.">
        <HistoryFeed events={await getBuyerOfferSubmissionHistoryEvents("admin", record.id)} compact />
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
