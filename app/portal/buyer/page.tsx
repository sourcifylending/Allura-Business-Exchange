import Link from "next/link";
import { PageCard } from "@/components/page-card";
import { HistoryFeed } from "@/components/history-feed";
import { LifecycleTimeline } from "@/components/lifecycle-timeline";
import { PortalAccessSummary } from "@/components/portal-access-summary";
import { PortalShell } from "@/components/portal-shell";
import { BuyerOpportunityCard } from "@/components/buyer-opportunity-card";
import { BuyerOfferActivityCard } from "@/components/buyer-offer-activity-card";
import { PortalTransferCard } from "@/components/portal-transfer-card";
import { PortalNotificationCard } from "@/components/portal-notification-card";
import { buildLifecycleTimelineEvents, getBuyerDealLifecycleRecords } from "@/lib/deals";
import { RequestCard } from "@/components/request-card";
import {
  getBuyerPortalInteractionsForApplication,
  getBuyerPortalOpportunities,
} from "@/lib/buyer-opportunities";
import { getBuyerPortalOfferSubmissions } from "@/lib/buyer-offers";
import { getBuyerPortalContracts } from "@/lib/portal-contracts";
import { getBuyerPortalTransfers } from "@/lib/portal-transfers";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireBuyerPortalAccess } from "@/lib/portal-access";
import { getBuyerPortalRequests, portalRequestSummaryCount } from "@/lib/portal-requests";
import { buildPortalNotifications, summarizePortalNotifications } from "@/lib/portal-monitoring";
import { getBuyerHistoryFeed, summarizeHistory } from "@/lib/history";

export const dynamic = "force-dynamic";

type BuyerPortalPageProps = Readonly<{
  searchParams?: {
    activated?: string;
  };
}>;

export default async function BuyerPortalPage({ searchParams }: BuyerPortalPageProps) {
  const record = await requireBuyerPortalAccess();
  let opportunities: Awaited<ReturnType<typeof getBuyerPortalOpportunities>> = [];
  let interactions: Awaited<ReturnType<typeof getBuyerPortalInteractionsForApplication>> = [];
  let offerSubmissions: Awaited<ReturnType<typeof getBuyerPortalOfferSubmissions>> = [];
  let contracts: Awaited<ReturnType<typeof getBuyerPortalContracts>> = [];
  let transfers: Awaited<ReturnType<typeof getBuyerPortalTransfers>> = [];
  let dealRecords: Awaited<ReturnType<typeof getBuyerDealLifecycleRecords>> = [];
  let requests: Awaited<ReturnType<typeof getBuyerPortalRequests>> = [];
  let history: Awaited<ReturnType<typeof getBuyerHistoryFeed>> = [];

  if (record.status === "activated") {
    [opportunities, interactions, offerSubmissions, contracts, transfers, dealRecords, requests, history] = await Promise.all([
      getBuyerPortalOpportunities(),
      getBuyerPortalInteractionsForApplication(record.id),
      getBuyerPortalOfferSubmissions(record.id),
      getBuyerPortalContracts(record.id),
      getBuyerPortalTransfers(record.id),
      getBuyerDealLifecycleRecords(record.id),
      getBuyerPortalRequests(record.id),
      getBuyerHistoryFeed(record.id),
    ]);
  }
  const savedCount = interactions.filter((interaction) => interaction.interaction_type === "saved").length;
  const interestedCount = interactions.filter((interaction) => interaction.interaction_type === "interest").length;
  const requestSummary = portalRequestSummaryCount(requests);
  const notifications = record.status === "activated" ? buildPortalNotifications("buyer", requests, dealRecords) : [];
  const notificationSummary = summarizePortalNotifications(notifications);
  const historySummary = summarizeHistory(history);
  const savedOpportunityIds = new Set(
    interactions.filter((interaction) => interaction.interaction_type === "saved").map((interaction) => interaction.asset_packaging_id),
  );
  const interestedOpportunityIds = new Set(
    interactions
      .filter((interaction) => interaction.interaction_type === "interest")
      .map((interaction) => interaction.asset_packaging_id),
  );

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title="Buyer dashboard"
      description="Controlled access for invited buyer users. This is the buyer portal foundation."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      {searchParams?.activated ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Buyer portal access activated successfully.
        </div>
      ) : null}

      {record.status === "invited" ? (
        <PageCard title="Activation pending" description="The buyer invite has not been fully activated yet.">
          <p className="text-sm leading-6 text-ink-700">
            Please finish the invite email flow. Once the invited account authenticates successfully,
            the portal will activate.
          </p>
        </PageCard>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <PortalAccessSummary
            title="Buyer application summary"
            description="This linked application is the source of truth for your buyer access."
            record={record}
            accountTypeLabel="Buyer portal"
            summaryItems={[
              { label: "Buyer type", value: record.buyer_type },
              { label: "Budget", value: record.budget_range },
              { label: "Niches of interest", value: record.niches_of_interest.join(", ") || "None" },
              { label: "Asset preferences", value: record.asset_preferences.join(", ") || "None" },
              { label: "Proof of funds", value: record.proof_of_funds_status },
              { label: "Urgency", value: record.urgency },
            ]}
          />

          <div className="grid gap-6">
            <PageCard title="Next steps" description="The buyer workspace grows from this foundation.">
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>Review your approved access details</div>
                <div>Use the curated opportunities surface</div>
                <div>Visit documents when supporting files are ready</div>
              </div>
            </PageCard>

            <PageCard title="Account readiness" description="The current access state and what happens next.">
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>Status: {record.status.replaceAll("_", " ")}</div>
                <div>Linked user: {record.linked_user_id ?? "Pending"}</div>
                <div>Invite-only activation: complete</div>
              </div>
            </PageCard>

            <PageCard title="Progress timeline" description="A sanitized lifecycle view of your latest linked deal.">
              {dealRecords[0] ? (
                <LifecycleTimeline
                  title={dealRecords[0].asset_name}
                  description={dealRecords[0].buyer_status_label}
                  events={buildLifecycleTimelineEvents(dealRecords[0], "buyer")}
                />
              ) : (
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>No linked deal timeline is available yet.</div>
                  <div>The timeline appears once a portal-visible opportunity becomes an active deal chain.</div>
                </div>
              )}
            </PageCard>

            <PageCard title="Opportunities" description="A controlled opportunity surface for activated buyer users.">
              {record.status === "activated" ? (
                opportunities.length > 0 ? (
                  <div className="grid gap-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Stat label="Visible opportunities" value={opportunities.length} />
                      <Stat label="Saved" value={savedCount} />
                      <Stat label="Interested" value={interestedCount} />
                    </div>
                    <div className="grid gap-4 xl:grid-cols-2">
                      {opportunities.slice(0, 2).map((opportunity) => (
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
                    <div className="text-sm leading-6 text-ink-600">
                      Open the opportunities center for the full invite-only list.
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 text-sm leading-6 text-ink-700">
                    <div>No portal-visible opportunities are ready yet.</div>
                    <div>This area will surface controlled opportunities when admins mark them visible.</div>
                  </div>
                )
              ) : (
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>Activate your invite to unlock buyer opportunities.</div>
                  <div>The controlled opportunity center appears only after activation completes.</div>
                </div>
              )}
            </PageCard>

            <PageCard title="Request center" description="Portal-issued action items and document requests.">
              {requests.length > 0 ? (
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Stat label="Open" value={requestSummary.open} />
                    <Stat label="Overdue" value={requestSummary.overdue} />
                    <Stat label="Completed" value={requestSummary.completed} />
                  </div>
                  <div className="grid gap-4">
                    {requests.slice(0, 2).map((request) => (
                      <RequestCard key={request.id} record={request} href={`/portal/buyer/requests/${request.id}`} />
                    ))}
                  </div>
                  <div className="text-sm leading-6 text-ink-600">
                    Open the requests center for the full portal action list.
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>No action items are assigned yet.</div>
                  <div>Requests will appear here when admin assigns a controlled task or document request.</div>
                </div>
              )}
            </PageCard>

            <PageCard title="Notifications" description="Safe summaries of recent portal updates and reminders.">
              {notifications.length > 0 ? (
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Stat label="Open items" value={notificationSummary.open} />
                    <Stat label="Overdue" value={notificationSummary.overdue} />
                    <Stat label="Recent" value={notificationSummary.recent} />
                  </div>
                  <div className="grid gap-4">
                    {notifications.slice(0, 2).map((notification) => (
                      <PortalNotificationCard
                        key={notification.key}
                        record={notification}
                        href={notification.detail_href}
                        actionLabel="Open detail"
                      />
                    ))}
                  </div>
                  <div className="text-sm leading-6 text-ink-600">Open the notifications center for the full update feed.</div>
                </div>
              ) : (
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>No notifications are available yet.</div>
                  <div>Notifications appear when requests or deal milestones change.</div>
                </div>
              )}
            </PageCard>

            <PageCard title="Recent history" description="A safe feed of your own latest buyer-linked events.">
              {history.length > 0 ? (
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Stat label="Total" value={historySummary.total} />
                    <Stat label="Recent" value={historySummary.recent} />
                    <Stat label="Completed" value={historySummary.completed} />
                  </div>
                  <HistoryFeed events={history.slice(0, 2)} compact />
                  <div className="text-sm leading-6 text-ink-600">
                    Open the history center for the full safe timeline.
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>No history yet.</div>
                  <div>Your feed appears once the buyer chain records meaningful activity.</div>
                </div>
              )}
            </PageCard>

            <PageCard title="Offer activity" description="Your structured offer submissions and internal review states.">
              {offerSubmissions.length > 0 ? (
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Stat label="Submissions" value={offerSubmissions.length} />
                    <Stat label="Open" value={offerSubmissions.filter((offer) => offer.status === "submitted" || offer.status === "under_review").length} />
                    <Stat
                      label="Presented"
                      value={
                        offerSubmissions.filter(
                          (offer) => offer.status === "approved_to_present" || offer.status === "converted_to_offer",
                        ).length
                      }
                    />
                  </div>
                  <div className="grid gap-4">
                    {offerSubmissions.slice(0, 2).map((record) => (
                      <BuyerOfferActivityCard key={record.id} record={record} />
                    ))}
                  </div>
                  <div className="text-sm leading-6 text-ink-600">
                    Open the offers area to review every submission and its latest status.
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>No offer submissions yet.</div>
                  <div>Submit an offer from a portal-visible opportunity to begin the workflow.</div>
                </div>
              )}
            </PageCard>

            <PageCard title="Contracts" description="Safe contract progress and transfer readiness labels only.">
              {contracts.length > 0 ? (
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Stat label="Contracts" value={contracts.length} />
                    <Stat
                      label="Ready"
                      value={contracts.filter((contract) => contract.portal_status === "ready_for_transfer").length}
                    />
                    <Stat
                      label="In progress"
                      value={contracts.filter((contract) => contract.portal_status === "in_review" || contract.portal_status === "awaiting_admin").length}
                    />
                  </div>
                  <div className="grid gap-3">
                    {contracts.slice(0, 2).map((contract) => (
                      <div
                        key={contract.id}
                        className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700"
                      >
                        <div className="text-xs font-semibold tracking-[0.2em] text-ink-500 uppercase">
                          {contract.portal_status.replaceAll("_", " ")}
                        </div>
                        <div className="mt-1 font-semibold text-ink-950">{contract.asset_name}</div>
                        <div className="mt-1">Next step: {contract.safe_next_step}</div>
                        <Link
                          href={`/portal/buyer/contracts/${contract.id}`}
                          className="mt-3 inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                        >
                          Open contract
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm leading-6 text-ink-600">
                    Open the contracts center for the full controlled list.
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>No contracts are linked yet.</div>
                  <div>Qualified offers will surface contract records here when admin advances them.</div>
                </div>
              )}
            </PageCard>

            <PageCard title="Transfers" description="Safe transfer progress and closeout readiness labels only.">
              {transfers.length > 0 ? (
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Stat label="Transfers" value={transfers.length} />
                    <Stat
                      label="Ready"
                      value={transfers.filter((transfer) => transfer.transfer_status === "ready_to_close").length}
                    />
                    <Stat
                      label="Completed"
                      value={transfers.filter((transfer) => transfer.transfer_status === "completed").length}
                    />
                  </div>
                  <div className="grid gap-4">
                    {transfers.slice(0, 2).map((transfer) => (
                      <PortalTransferCard
                        key={transfer.id}
                        record={transfer}
                        href={`/portal/buyer/transfers/${transfer.id}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm leading-6 text-ink-600">
                    Open the transfers center for the full controlled list.
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>No transfers are linked yet.</div>
                  <div>Transfer records appear here when contracts are advanced into closeout.</div>
                </div>
              )}
            </PageCard>
          </div>
        </div>
      )}
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
