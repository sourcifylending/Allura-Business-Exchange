import Link from "next/link";
import { PageCard } from "@/components/page-card";
import { HistoryFeed } from "@/components/history-feed";
import { PortalShell } from "@/components/portal-shell";
import { summarizeHistory, getSellerHistoryFeed } from "@/lib/history";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedSellerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

export default async function SellerHistoryPage() {
  const record = await requireActivatedSellerPortalAccess();
  const events = await getSellerHistoryFeed(record.id);
  const summary = summarizeHistory(events);

  return (
    <PortalShell
      eyebrow="Seller portal"
      title="Seller history"
      description="Safe history feed for your own seller-linked chain."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      <div className="grid gap-6">
        <PageCard title="Overview" description="Recent safe history derived from your own portal-linked records.">
          <div className="grid gap-3 sm:grid-cols-4">
            <Metric label="Total events" value={String(summary.total)} />
            <Metric label="Recent" value={String(summary.recent)} />
            <Metric label="Completed" value={String(summary.completed)} />
            <Metric label="Overdue" value={String(summary.overdue)} />
          </div>
        </PageCard>

        <PageCard title="History feed" description="Only safe labels and timestamps are shown here.">
          <HistoryFeed
            events={events}
            emptyTitle="No history yet"
            emptyDescription="Activity appears once your seller chain records meaningful events."
          />
          <div className="mt-4">
            <Link
              href="/portal/seller"
              className="inline-flex items-center justify-center rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
            >
              Back to dashboard
            </Link>
          </div>
        </PageCard>
      </div>
    </PortalShell>
  );
}

function Metric({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink-950">{value}</div>
    </div>
  );
}
