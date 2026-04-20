import Link from "next/link";
import { notFound } from "next/navigation";
import { LifecycleTimeline } from "@/components/lifecycle-timeline";
import { PageCard } from "@/components/page-card";
import { PortalNotificationCard } from "@/components/portal-notification-card";
import { buildLifecycleTimelineEvents, getSellerDealLifecycleRecords } from "@/lib/deals";
import { getSellerPortalRequests } from "@/lib/portal-requests";
import { buildPortalNotifications, portalNotificationCenterRoute } from "@/lib/portal-monitoring";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { PortalShell } from "@/components/portal-shell";
import { requireSellerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

type SellerNotificationDetailPageProps = Readonly<{
  params: {
    kind: string;
    id: string;
  };
}>;

export default async function SellerNotificationDetailPage({ params }: SellerNotificationDetailPageProps) {
  const record = await requireSellerPortalAccess();
  const activated = record.status === "activated";
  let requests: Awaited<ReturnType<typeof getSellerPortalRequests>> = [];
  let deals: Awaited<ReturnType<typeof getSellerDealLifecycleRecords>> = [];

  if (activated) {
    [requests, deals] = await Promise.all([getSellerPortalRequests(record.id), getSellerDealLifecycleRecords(record.id)]);
  }
  const notifications = activated ? buildPortalNotifications("seller", requests, deals) : [];
  const notification = notifications.find((item) => item.kind === params.kind && item.source_id === params.id);

  if (!notification) {
    notFound();
  }

  const request = params.kind === "request" ? requests.find((item) => item.id === params.id) ?? null : null;
  const deal = params.kind === "deal" ? deals.find((item) => item.id === params.id) ?? null : null;

  return (
    <PortalShell
      eyebrow="Seller portal"
      title="Notification detail"
      description="A safe summary with a link back to the native portal page."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      <div className="grid gap-6">
        <PortalNotificationCard record={notification} href={notification.href} actionLabel="Open source page" />

        <PageCard title="Detail" description="This is a derived notification, not a chat thread.">
          {notification.kind === "request" && request ? (
            <div className="grid gap-4 text-sm leading-6 text-ink-700">
              <div className="text-base font-semibold text-ink-950">{request.title}</div>
              <div>Type: {request.request_type_label}</div>
              <div>Status: {request.safe_status_label}</div>
              <div>Next step: {request.safe_next_step}</div>
              <div>Due date: {request.due_date ? new Date(request.due_date).toLocaleDateString() : "Not set"}</div>
              <div>{request.safe_summary}</div>
              <Link
                href={notification.href}
                className="inline-flex w-fit items-center justify-center rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
              >
                Open request
              </Link>
            </div>
          ) : deal ? (
            <div className="grid gap-4">
              <div className="grid gap-2 text-sm leading-6 text-ink-700">
                <div className="text-base font-semibold text-ink-950">{deal.asset_name}</div>
                <div>Lifecycle stage: {deal.stage}</div>
                <div>Current status: {deal.current_status_label}</div>
                <div>Safe summary: {deal.current_summary}</div>
              </div>
              <LifecycleTimeline
                title={deal.asset_name}
                description={deal.seller_status_label}
                events={buildLifecycleTimelineEvents(deal, "seller")}
              />
              <Link
                href={notification.href}
                className="inline-flex w-fit items-center justify-center rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
              >
                Open source page
              </Link>
            </div>
          ) : (
            <div className="text-sm leading-6 text-ink-700">
              Open the notifications center to view the current portal activity feed.
            </div>
          )}
        </PageCard>

        <PageCard title="Back" description="Return to the seller notification center.">
          <Link
            href={portalNotificationCenterRoute("seller")}
            className="inline-flex items-center justify-center rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-800 transition hover:border-accent-200 hover:text-accent-700"
          >
            Back to notifications
          </Link>
        </PageCard>
      </div>
    </PortalShell>
  );
}
