import { PageCard } from "@/components/page-card";
import { HistoryFeed } from "@/components/history-feed";
import { PortalAccessSummary } from "@/components/portal-access-summary";
import { PortalShell } from "@/components/portal-shell";
import { LifecycleTimeline } from "@/components/lifecycle-timeline";
import Link from "next/link";
import { buildLifecycleTimelineEvents, getSellerDealLifecycleRecords } from "@/lib/deals";
import { RequestCard } from "@/components/request-card";
import { PortalNotificationCard } from "@/components/portal-notification-card";
import { getSellerPortalContracts } from "@/lib/portal-contracts";
import { getSellerPortalTransfers } from "@/lib/portal-transfers";
import { getSellerPortalRequests, portalRequestSummaryCount } from "@/lib/portal-requests";
import { PortalTransferCard } from "@/components/portal-transfer-card";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireSellerPortalAccess } from "@/lib/portal-access";
import { buildPortalNotifications, summarizePortalNotifications } from "@/lib/portal-monitoring";
import { getSellerHistoryFeed, summarizeHistory } from "@/lib/history";

export const dynamic = "force-dynamic";

type SellerPortalPageProps = Readonly<{
  searchParams?: {
    activated?: string;
  };
}>;

export default async function SellerPortalPage({ searchParams }: SellerPortalPageProps) {
  const record = await requireSellerPortalAccess();
  const dealRecords = record.status === "activated" ? await getSellerDealLifecycleRecords(record.id) : [];
  const contracts = record.status === "activated" ? await getSellerPortalContracts(record.id) : [];
  const transfers = record.status === "activated" ? await getSellerPortalTransfers(record.id) : [];
  const requests = record.status === "activated" ? await getSellerPortalRequests(record.id) : [];
  const history = record.status === "activated" ? await getSellerHistoryFeed(record.id) : [];
  const requestSummary = portalRequestSummaryCount(requests);
  const notifications = record.status === "activated" ? buildPortalNotifications("seller", requests, dealRecords) : [];
  const notificationSummary = summarizePortalNotifications(notifications);
  const historySummary = summarizeHistory(history);

  return (
    <PortalShell
      eyebrow="Seller portal"
      title="Seller dashboard"
      description="Controlled access for invited seller users. This is the seller portal foundation."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      {searchParams?.activated ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Seller portal access activated successfully.
        </div>
      ) : null}

      {record.status === "invited" ? (
        <PageCard title="Activation pending" description="The seller invite has not been fully activated yet.">
          <p className="text-sm leading-6 text-ink-700">
            Please finish the invite email flow. Once the invited account authenticates successfully,
            the portal will activate.
          </p>
        </PageCard>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <PortalAccessSummary
            title="Seller application summary"
            description="This linked application is the source of truth for your seller access."
            record={record}
            accountTypeLabel="Seller portal"
            summaryItems={[
              { label: "Business name", value: record.business_name },
              { label: "Industry", value: record.industry },
              { label: "Website", value: record.website || "Not provided" },
              { label: "Asset type", value: record.asset_type },
              { label: "Asking range", value: record.asking_price_range },
            ]}
          />

          <div className="grid gap-6">
            <PageCard title="Next steps" description="The seller workspace grows from this foundation.">
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>Review your approved access details</div>
                <div>Prepare the business summary and documents</div>
                <div>Use packaging and closeout tools later when ready</div>
              </div>
            </PageCard>

            <PageCard title="Review progress" description="The current access state and what happens next.">
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
                  description={dealRecords[0].seller_status_label}
                  events={buildLifecycleTimelineEvents(dealRecords[0], "seller")}
                />
              ) : (
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>No linked deal timeline is available yet.</div>
                  <div>The timeline appears once a seller opportunity becomes an active deal chain.</div>
                </div>
              )}
            </PageCard>

            <PageCard title="Controlled foundation" description="No public signup or bypass route exists here.">
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>Portal access remains separate from public application submit.</div>
                <div>Admin approval remains the gatekeeper.</div>
                <div>More features will be layered in later phases.</div>
              </div>
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
                      <RequestCard key={request.id} record={request} href={`/portal/seller/requests/${request.id}`} />
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

            <PageCard title="Recent history" description="A safe feed of your own latest seller-linked events.">
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
                  <div>Your feed appears once the seller chain records meaningful activity.</div>
                </div>
              )}
            </PageCard>

            <PageCard title="Offer activity" description="Sanitized inbound offer activity appears here once linked opportunities receive interest.">
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>Review offer activity without exposing buyer identity.</div>
                <div>See only safe counts and status summaries.</div>
              </div>
              <Link
                href="/portal/seller/offers"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
              >
                Open offer activity
              </Link>
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
                          href={`/portal/seller/contracts/${contract.id}`}
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
                  <div>Qualified deals will surface contract records here when admin advances them.</div>
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
                        href={`/portal/seller/transfers/${transfer.id}`}
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
