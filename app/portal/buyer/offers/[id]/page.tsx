import Link from "next/link";
import { PageCard } from "@/components/page-card";
import { HistoryFeed } from "@/components/history-feed";
import { PortalShell } from "@/components/portal-shell";
import { BuyerOfferStatusPill } from "@/components/buyer-offer-status-pill";
import { BuyerSafeStatusPill } from "@/components/buyer-safe-status-pill";
import { getBuyerPortalOfferSubmissionById } from "@/lib/buyer-offers";
import { getOfferRecordById } from "@/lib/closeout-ops";
import { getBuyerOfferSubmissionHistoryEvents } from "@/lib/history";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedBuyerPortalAccess } from "@/lib/portal-access";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type BuyerOfferDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
  };
}>;

export default async function BuyerOfferDetailPage({ params, searchParams }: BuyerOfferDetailPageProps) {
  const record = await requireActivatedBuyerPortalAccess();
  const submission = await getBuyerPortalOfferSubmissionById(record.id, params.id);

  if (!submission) {
    redirect("/portal/buyer/offers?error=Offer%20submission%20not%20found.");
  }

  const linkedOffer = submission.offer_record_id ? await getOfferRecordById(submission.offer_record_id) : null;
  const converted = submission.status === "converted_to_offer";

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title={submission.asset_name}
      description="Your buyer offer submission with controlled review status."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Offer detail {searchParams.saved === "updated" ? "updated" : "saved"} successfully.
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <PageCard title="Offer detail" description="This page shows your own submission only. Seller contact stays hidden.">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
                  {submission.niche}
                </div>
                <div className="mt-1 text-sm leading-6 text-ink-600">{submission.asset_type}</div>
              </div>
              <div className="grid justify-items-end gap-2">
                <BuyerOfferStatusPill status={submission.status} />
                <BuyerSafeStatusPill status={submission.buyer_visible_status} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Stat label="Proposed price" value={submission.proposed_price} />
              <Stat label="Structure" value={submission.structure_preference} />
              <Stat label="Financing" value={submission.financing_plan} />
              <Stat label="Target close date" value={new Date(submission.target_close_date).toLocaleDateString()} />
              <Stat label="Submitted" value={new Date(submission.created_at).toLocaleDateString()} />
              <Stat label="Updated" value={new Date(submission.updated_at).toLocaleDateString()} />
            </div>

            <div className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5 text-sm leading-6 text-ink-700">
              <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Buyer notes</div>
              <div className="mt-2 whitespace-pre-line">{submission.notes}</div>
            </div>

            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>Opportunity summary: {submission.portal_summary}</div>
              <div>Asking price: {submission.asking_price}</div>
              <div>Internal review state: {submission.status.replaceAll("_", " ")}</div>
              <div>Buyer-visible status: {submission.buyer_visible_status}</div>
              <div>Internal offer bridge: {converted ? "Created" : "Not created yet"}</div>
            </div>
          </div>
        </PageCard>

        <div className="grid gap-6">
        <PageCard title="Next steps" description="What you can do from here.">
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>Review the submission status</div>
              <div>Open the original opportunity if you want to compare listings</div>
              <div>Wait for admin review or presentation</div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href={`/portal/buyer/opportunities/${submission.asset_packaging_id}`}
                className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
              >
                Open opportunity
              </Link>
              {linkedOffer?.contract_row_id ? (
                <Link
                  href={`/portal/buyer/contracts/${linkedOffer.contract_row_id}`}
                  className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Open contract
                </Link>
              ) : null}
              <Link
                href="/portal/buyer/offers"
                className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Back to offers
              </Link>
            </div>
          </PageCard>

          <PageCard title="History" description="Safe buyer-side submission activity with sanitized labels and timestamps.">
            <HistoryFeed events={await getBuyerOfferSubmissionHistoryEvents("buyer", submission.id)} compact />
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
