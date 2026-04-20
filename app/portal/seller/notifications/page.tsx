import { PageCard } from "@/components/page-card";
import { PortalNotificationCard } from "@/components/portal-notification-card";
import { PortalShell } from "@/components/portal-shell";
import { PortalAccessSummary } from "@/components/portal-access-summary";
import { LifecycleTimeline } from "@/components/lifecycle-timeline";
import { buildLifecycleTimelineEvents, getSellerDealLifecycleRecords } from "@/lib/deals";
import { getSellerPortalRequests } from "@/lib/portal-requests";
import {
  buildPortalNotifications,
  summarizePortalNotifications,
} from "@/lib/portal-monitoring";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireSellerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

export default async function SellerNotificationsPage() {
  const record = await requireSellerPortalAccess();
  const activated = record.status === "activated";
  let requests: Awaited<ReturnType<typeof getSellerPortalRequests>> = [];
  let deals: Awaited<ReturnType<typeof getSellerDealLifecycleRecords>> = [];

  if (activated) {
    [requests, deals] = await Promise.all([getSellerPortalRequests(record.id), getSellerDealLifecycleRecords(record.id)]);
  }

  const notifications = activated ? buildPortalNotifications("seller", requests, deals) : [];
  const summary = summarizePortalNotifications(notifications);

  return (
    <PortalShell
      eyebrow="Seller portal"
      title="Seller notifications"
      description="Safe action items and lifecycle updates for this seller account."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      <PortalAccessSummary
        title="Notification summary"
        description="Derived from requests and linked deal lifecycle timestamps."
        record={record}
        accountTypeLabel="Seller portal"
        summaryItems={[
          { label: "Open items", value: String(summary.open) },
          { label: "Overdue", value: String(summary.overdue) },
          { label: "Recent updates", value: String(summary.recent) },
        ]}
      />

      {record.status === "invited" ? (
        <PageCard title="Activation pending" description="Notifications unlock after invite activation.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Finish activation to see seller-specific action items.</div>
            <div>No portal notifications are exposed before activation completes.</div>
          </div>
        </PageCard>
      ) : (
        <div className="grid gap-6">
          {deals[0] ? (
            <PageCard title="Latest lifecycle view" description="Sanitized progress from the latest linked deal.">
              <LifecycleTimeline
                title={deals[0].asset_name}
                description={deals[0].seller_status_label}
                events={buildLifecycleTimelineEvents(deals[0], "seller")}
              />
            </PageCard>
          ) : null}

          <PageCard title="Notification feed" description="Metadata-first items with safe links only.">
            {notifications.length > 0 ? (
              <div className="grid gap-4">
                {notifications.map((notification) => (
                  <PortalNotificationCard
                    key={notification.key}
                    record={notification}
                    href={notification.detail_href}
                    actionLabel="Open detail"
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-2 text-sm leading-6 text-ink-700">
                <div>No notifications yet.</div>
                <div>Action items and lifecycle updates will appear here when the portal chain changes.</div>
              </div>
            )}
          </PageCard>
        </div>
      )}
    </PortalShell>
  );
}
