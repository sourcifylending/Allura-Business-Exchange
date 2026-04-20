import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin-page-header";
import { HistoryFeed } from "@/components/history-feed";
import { LifecycleTimeline } from "@/components/lifecycle-timeline";
import { PageCard } from "@/components/page-card";
import { DealLifecycleCard } from "@/components/deal-lifecycle-card";
import {
  buildLifecycleTimelineEvents,
  dealLifecycleStageLabel,
  getDealLifecycleRecordById,
} from "@/lib/deals";
import { getDealHistoryEvents } from "@/lib/history";

export const dynamic = "force-dynamic";

type AdminDealDetailPageProps = Readonly<{
  params: {
    id: string;
  };
}>;

export default async function AdminDealDetailPage({ params }: AdminDealDetailPageProps) {
  const record = await getDealLifecycleRecordById(params.id);

  if (!record) {
    redirect("/admin/deals?error=Deal%20not%20found.");
  }

  const events = buildLifecycleTimelineEvents(record, "admin");

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Deal Detail"
        description="Admin command view for the full lifecycle chain from packaging to archive."
      />

      <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <DealLifecycleCard record={record} href={`/admin/deals/${record.id}`} />

        <PageCard title="Lifecycle chain" description="Native detail links for each segment of the deal.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Lifecycle stage: {dealLifecycleStageLabel(record.stage)}</div>
            <div>Current status: {record.current_status_label}</div>
            <div>Buyer status: {record.buyer_status_label}</div>
            <div>Seller status: {record.seller_status_label}</div>
          </div>

          <div className="mt-4 grid gap-3">
            <ChainLink label="Packaging / opportunity" href="/admin/packaging" value={record.asset_name} />
            {record.submission_id ? (
              <ChainLink label="Buyer submission" href={`/admin/buyer-offers/${record.submission_id}`} value={record.submission_id} />
            ) : (
              <EmptyLink label="Buyer submission" value="No buyer submission linked yet." />
            )}
            {record.offer_id ? (
              <ChainLink label="Internal offer" href={`/admin/offers/${record.offer_id}`} value={record.offer_id} />
            ) : (
              <EmptyLink label="Internal offer" value="No internal offer linked yet." />
            )}
            {record.contract_id ? (
              <ChainLink label="Contract" href={`/admin/contracts/${record.contract_id}`} value={record.contract_record_id ?? record.contract_id} />
            ) : (
              <EmptyLink label="Contract" value="No contract linked yet." />
            )}
            {record.transfer_id ? (
              <ChainLink label="Transfer" href={`/admin/transfers/${record.transfer_id}`} value={record.transfer_id} />
            ) : (
              <EmptyLink label="Transfer" value="No transfer linked yet." />
            )}
            {record.transfer_id ? (
              <ChainLink label="Closeout" href={`/admin/closeout/${record.transfer_id}`} value={record.transfer_id} />
            ) : (
              <EmptyLink label="Closeout" value="No closeout record linked yet." />
            )}
          </div>
        </PageCard>
      </div>

      <LifecycleTimeline
        title="Lifecycle timeline"
        description="Milestones are derived from the chain timestamps and never fabricated."
        events={events}
      />

      <PageCard title="History" description="Derived deal activity with safe timestamps and event labels.">
        <HistoryFeed events={await getDealHistoryEvents("admin", record.id)} compact />
      </PageCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <PageCard title="Milestone snapshot" description="Key dates and completion markers.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Portal visible: {record.portal_visible ? "Yes" : "No"}</div>
            <div>Interest events: {record.interest_count}</div>
            <div>Last meaningful update: {record.last_meaningful_at ? new Date(record.last_meaningful_at).toLocaleString() : "Not yet"}</div>
            <div>Completed: {record.is_completed ? "Yes" : "No"}</div>
            <div>Archived: {record.is_archived ? "Yes" : "No"}</div>
          </div>
        </PageCard>

        <PageCard title="Notes" description="What this page is for.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>This page is a summary and command layer, not a second editor.</div>
            <div>Native admin detail pages remain the editing surfaces for each segment.</div>
            <div>Portal users only see sanitized progress labels on their own chain.</div>
          </div>
        </PageCard>
      </div>
    </div>
  );
}

function ChainLink({
  label,
  href,
  value,
}: Readonly<{
  label: string;
  href: string;
  value: string;
}>) {
  return (
    <Link
      href={href}
      className="grid gap-2 rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 transition hover:border-accent-300 hover:text-accent-700"
    >
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="text-sm font-semibold text-ink-950">{value}</div>
    </Link>
  );
}

function EmptyLink({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="grid gap-2 rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-4 py-3">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="text-sm font-semibold text-ink-600">{value}</div>
    </div>
  );
}
