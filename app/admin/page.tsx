import { HistoryFeed } from "@/components/history-feed";
import { AdminMetricCard } from "@/components/admin-metric-card";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { getAdminActivityHistory, summarizeHistory } from "@/lib/history";

const cards = [
  "New Ideas",
  "Ideas Approved to Build",
  "AI Assets In Build",
  "AI Assets Ready to List",
  "AI Asset Buyer Inquiries",
  "Active Listings",
  "Offers In Progress",
  "Contracts Pending",
  "Payments Pending",
  "Transfers In Progress",
  "Business Seller Submissions",
  "Tasks Due",
];

export default async function AdminPage() {
  const history = await getAdminActivityHistory();
  const summary = summarizeHistory(history);
  const recent = history.slice(0, 3);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Dashboard"
        description="A clean command center for Allura's internal operating system, with AI asset flow front and center."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <AdminMetricCard key={card} label={card} />
        ))}
      </section>

      <PageCard title="Recent activity" description="A compact readout of the latest derived audit events.">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric label="Total" value={String(summary.total)} />
          <Metric label="Recent" value={String(summary.recent)} />
          <Metric label="Completed" value={String(summary.completed)} />
          <Metric label="Overdue" value={String(summary.overdue)} />
        </div>
        <div className="mt-5">
          <HistoryFeed
            events={recent}
            compact
            emptyTitle="No recent activity"
            emptyDescription="Meaningful events will appear here once the deal chain starts moving."
          />
        </div>
      </PageCard>

      <div className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <div className="text-sm font-semibold tracking-[0.22em] text-accent-700 uppercase">
          Priority Stack
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "New Ideas",
            "AI Assets In Build",
            "AI Assets Ready to List",
            "AI Asset Buyer Inquiries",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
              <div className="text-sm font-medium text-ink-900">{item}</div>
              <div className="mt-2 text-sm text-ink-600">Pinned to the top of the admin flow.</div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
