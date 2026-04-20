import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import { BuyerOfferSubmitForm } from "@/components/buyer-offer-submit-form";
import { BuyerOfferStatusPill } from "@/components/buyer-offer-status-pill";
import Link from "next/link";
import {
  getBuyerPortalInteractionsForApplication,
  getBuyerPortalOpportunityById,
} from "@/lib/buyer-opportunities";
import { getBuyerPortalOfferSubmissionForOpportunity } from "@/lib/buyer-offers";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedBuyerPortalAccess } from "@/lib/portal-access";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

  type BuyerOpportunityDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    submitted?: string;
    saved?: string;
    error?: string;
  };
}>;

export default async function BuyerOpportunityDetailPage({
  params,
  searchParams,
}: BuyerOpportunityDetailPageProps) {
  const record = await requireActivatedBuyerPortalAccess();
  const opportunity = await getBuyerPortalOpportunityById(params.id);

  if (!opportunity) {
    redirect("/portal/buyer/opportunities?error=This%20opportunity%20is%20not%20available.");
  }

  const interactions = await getBuyerPortalInteractionsForApplication(record.id);
  const submission = await getBuyerPortalOfferSubmissionForOpportunity(record.id, opportunity.id);
  const interested = interactions.some(
    (interaction) => interaction.asset_packaging_id === opportunity.id && interaction.interaction_type === "interest",
  );
  const saved = interactions.some(
    (interaction) => interaction.asset_packaging_id === opportunity.id && interaction.interaction_type === "saved",
  );
  const activeSubmission = submission && submission.status !== "declined" && submission.status !== "withdrawn";

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title={opportunity.asset_name}
      description="Controlled opportunity detail view for activated buyer users only."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      {searchParams?.submitted ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          {searchParams.submitted === "offer"
            ? "Offer submission recorded successfully."
            : "Submission recorded successfully."}
        </div>
      ) : null}
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-5 py-4 text-sm font-medium text-accent-800">
          {searchParams.saved === "interest"
            ? "Interest recorded successfully."
            : "Opportunity saved to your watchlist."}
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-[rgba(52,18,26,0.96)] px-5 py-4 text-sm font-medium text-rose-700">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <PageCard
          title="Safe opportunity summary"
          description="Only approved, portal-visible details are shown here. Seller identity and private diligence stay hidden."
        >
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Category" value={opportunity.niche} />
              <Stat label="Asset type" value={opportunity.asset_type} />
              <Stat label="Asking price" value={opportunity.asking_price} />
              <Stat label="Packaging state" value={opportunity.packaging_status.replaceAll("_", " ")} />
            </div>
            <div className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5 text-sm leading-6 text-ink-700">
              {opportunity.portal_summary}
            </div>
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div className="rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-4">
                <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                  One-line pitch
                </div>
                <div className="mt-1">{opportunity.one_line_pitch}</div>
              </div>
              <div className="rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-4">
                <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                  Listing description
                </div>
                <div className="mt-1">{opportunity.short_listing_description}</div>
              </div>
            </div>
          </div>
        </PageCard>

        <div className="grid gap-6">
          <PageCard title="Offer submission" description="Submit a structured offer intent only for this portal-visible opportunity.">
            {activeSubmission ? (
              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4">
                  <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Current status</div>
                  <div className="mt-3">
                    <BuyerOfferStatusPill status={submission.status} />
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-4 text-sm leading-6 text-ink-700">
                  Your offer is already on file. Admin will review it through the controlled pipeline.
                </div>
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>Proposed price: {submission.proposed_price}</div>
                  <div>Structure: {submission.structure_preference}</div>
                  <div>Target close date: {new Date(submission.target_close_date).toLocaleDateString()}</div>
                </div>
                <Link
                  href={`/portal/buyer/offers/${submission.id}`}
                  className="inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Open offer detail
                </Link>
              </div>
            ) : (
              <BuyerOfferSubmitForm opportunityId={opportunity.id} record={submission ?? undefined} />
            )}
          </PageCard>

          <PageCard title="Current state" description="Your current interaction state for this opportunity.">
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>Interest: {interested ? "Recorded" : "Not recorded yet"}</div>
              <div>Saved: {saved ? "Saved to watchlist" : "Not saved yet"}</div>
              <div>Opportunity visibility: portal-visible only</div>
              <div>Offer submission: {submission ? submission.status.replaceAll("_", " ") : "Not submitted yet"}</div>
            </div>
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
