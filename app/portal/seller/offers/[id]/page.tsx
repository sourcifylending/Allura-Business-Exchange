import Link from "next/link";
import { PageCard } from "@/components/page-card";
import { HistoryFeed } from "@/components/history-feed";
import { PortalShell } from "@/components/portal-shell";
import { BuyerSafeStatusPill } from "@/components/buyer-safe-status-pill";
import { OfferDispositionPill } from "@/components/offer-disposition-pill";
import {
  getSellerPortalOfferDetail,
  sellerOfferResponseLabels,
  sellerOfferResponseOrder,
  submitSellerOfferResponseAction,
} from "@/lib/seller-offers";
import { getDealHistoryEvents } from "@/lib/history";
import { getOfferRecordById } from "@/lib/closeout-ops";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedSellerPortalAccess } from "@/lib/portal-access";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type SellerOfferDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
  };
}>;

export default async function SellerOfferDetailPage({ params, searchParams }: SellerOfferDetailPageProps) {
  const record = await requireActivatedSellerPortalAccess();
  const detail = await getSellerPortalOfferDetail(record.id, params.id);

  if (!detail) {
    redirect("/portal/seller/offers?error=Offer%20activity%20not%20found.");
  }

  const linkedOffer = detail.latest_offer_record_id ? await getOfferRecordById(detail.latest_offer_record_id) : null;
  const historyEvents = await getDealHistoryEvents("seller", detail.asset_packaging_id);

  return (
    <PortalShell
      eyebrow="Seller portal"
      title={detail.asset_name}
      description="Controlled inbound offer detail for your linked seller opportunity."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Seller offer detail updated successfully.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Offer detail" description="Buyer identity stays hidden. Only the safe summary is shown.">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
                  {detail.asset_slug}
                </div>
                <div className="mt-1 text-sm leading-6 text-ink-600">{detail.portal_summary}</div>
              </div>
              <div className="grid justify-items-end gap-2">
                <OfferDispositionPill status={detail.latest_offer_disposition_status} />
                <BuyerSafeStatusPill status={detail.buyer_visible_status} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Stat label="Asking price" value={detail.asking_price} />
              <Stat label="Offer activity" value={`${detail.offer_count} inbound`} />
              <Stat label="Converted" value={`${detail.converted_offer_count} linked`} />
              <Stat
                label="Latest submission"
                value={detail.latest_submission_at ? new Date(detail.latest_submission_at).toLocaleDateString() : "Not set"}
              />
              <Stat
                label="Latest offer"
                value={detail.latest_offer_updated_at ? new Date(detail.latest_offer_updated_at).toLocaleDateString() : "Not set"}
              />
              <Stat label="Current status" value={detail.buyer_visible_status} />
            </div>

            <div className="grid gap-3 rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
              <div>Structure: {detail.latest_submission_structure_preference ?? "Not set"}</div>
              <div>Financing: {detail.latest_submission_financing_plan ?? "Not set"}</div>
              <div>Timeline: {detail.latest_submission_target_close_date ? new Date(detail.latest_submission_target_close_date).toLocaleDateString() : "Not set"}</div>
              <div>Buyer-visible status: {detail.buyer_visible_status}</div>
            </div>

            {detail.has_active_offer ? (
              <form action={submitSellerOfferResponseAction} className="grid gap-3">
                <input type="hidden" name="asset_packaging_id" value={detail.asset_packaging_id} />
                <input type="hidden" name="return_to" value={`/portal/seller/offers/${detail.asset_packaging_id}?saved=updated`} />
                <label className="grid gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                    Seller response
                  </span>
                  <select name="response_status" defaultValue="acknowledge_review" className={inputClass}>
                    {sellerOfferResponseOrder.map((status) => (
                      <option key={status} value={status}>
                        {sellerOfferResponseLabels[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                    Seller note
                  </span>
                  <textarea name="response_note" rows={4} className={inputClass} placeholder="Optional internal note for admin review." />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                  >
                    Save response
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
                This opportunity has not been promoted into an internal offer yet, so seller response actions are not available.
              </div>
            )}
          </div>
        </PageCard>

        <div className="grid gap-6">
          <PageCard title="Summary" description="Safe information only. Buyer identity remains hidden.">
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>Opportunity title: {detail.asset_name}</div>
              <div>Latest internal state: {detail.buyer_visible_status}</div>
              <div>Review timing: {detail.latest_submission_at ? new Date(detail.latest_submission_at).toLocaleDateString() : "Not set"}</div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/portal/seller/offers"
                className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Back to activity
              </Link>
              {linkedOffer?.contract_row_id ? (
                <Link
                  href={`/portal/seller/contracts/${linkedOffer.contract_row_id}`}
                  className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Open contract
                </Link>
              ) : null}
            </div>
          </PageCard>

          <PageCard title="History" description="Safe seller-side activity with sanitized labels and timestamps.">
            <HistoryFeed events={historyEvents} compact />
          </PageCard>
        </div>
      </div>
    </PortalShell>
  );
}

function Stat({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink-950">{value}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200";
