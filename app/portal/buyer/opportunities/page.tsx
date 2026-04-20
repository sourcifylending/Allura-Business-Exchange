import Link from "next/link";
import { BuyerOpportunityCard } from "@/components/buyer-opportunity-card";
import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import {
  getBuyerPortalInteractionsForApplication,
  getBuyerPortalOpportunities,
} from "@/lib/buyer-opportunities";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedBuyerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

type BuyerOpportunitiesPageProps = Readonly<{
  searchParams?: {
    saved?: string;
    error?: string;
  };
}>;

export default async function BuyerOpportunitiesPage({ searchParams }: BuyerOpportunitiesPageProps) {
  const record = await requireActivatedBuyerPortalAccess();
  const [opportunities, interactions] = await Promise.all([
    getBuyerPortalOpportunities(),
    getBuyerPortalInteractionsForApplication(record.id),
  ]);
  const savedOpportunityIds = new Set(
    interactions.filter((interaction) => interaction.interaction_type === "saved").map((interaction) => interaction.asset_packaging_id),
  );
  const interestedOpportunityIds = new Set(
    interactions
      .filter((interaction) => interaction.interaction_type === "interest")
      .map((interaction) => interaction.asset_packaging_id),
  );
  const savedOpportunities = opportunities.filter((opportunity) => savedOpportunityIds.has(opportunity.id));

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title="Buyer opportunities"
      description="Invite-only opportunities visible to activated buyer users."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgba(31,26,18,0.96)] px-5 py-4 text-sm font-medium text-accent-800">
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard
          title="Opportunity center"
          description="Only opportunities marked visible by admin appear here. Sensitive seller details stay out of view."
        >
          {opportunities.length > 0 ? (
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="Visible" value={opportunities.length} />
                <Stat label="Saved" value={savedOpportunities.length} />
                <Stat label="Interested" value={interactions.filter((interaction) => interaction.interaction_type === "interest").length} />
              </div>
              <div className="grid gap-4">
                {opportunities.map((opportunity) => (
                  <BuyerOpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    href={`/portal/buyer/opportunities/${opportunity.id}`}
                    interestState={{
                      saved: savedOpportunityIds.has(opportunity.id),
                      interested: interestedOpportunityIds.has(opportunity.id),
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>No portal-visible opportunities are ready yet.</div>
              <div>Admin will mark opportunities visible when they are approved for buyer viewing.</div>
            </div>
          )}
        </PageCard>

        <div className="grid gap-6">
          <PageCard title="Watchlist" description="Saved opportunities stay here until you review them.">
            {savedOpportunities.length > 0 ? (
              <div className="grid gap-3">
                {savedOpportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4"
                  >
                    <div className="text-xs font-semibold tracking-[0.2em] text-accent-700 uppercase">
                      {opportunity.niche}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-ink-950">{opportunity.asset_name}</div>
                    <div className="mt-2 text-sm leading-6 text-ink-600">{opportunity.portal_summary}</div>
                    <Link
                      href={`/portal/buyer/opportunities/${opportunity.id}`}
                      className="mt-4 inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                    >
                      Review opportunity
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>No saved opportunities yet.</div>
                <div>Use the save action on an opportunity detail page to add one here.</div>
              </div>
            )}
          </PageCard>

          <PageCard
            title="Next steps"
            description="The buyer center stays controlled and invite-only."
          >
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>Review visible opportunities</div>
              <div>Open a detail page for the safe summary</div>
              <div>Express interest when a listing fits your criteria</div>
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
  value: number;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink-950">{value}</div>
    </div>
  );
}
