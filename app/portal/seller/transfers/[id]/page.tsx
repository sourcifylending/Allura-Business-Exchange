import Link from "next/link";
import { redirect } from "next/navigation";
import { PageCard } from "@/components/page-card";
import { HistoryFeed } from "@/components/history-feed";
import { PortalShell } from "@/components/portal-shell";
import {
  getSellerPortalTransferById,
  portalTransferNextStepLabel,
  portalTransferStatusLabel,
} from "@/lib/portal-transfers";
import { getTransferHistoryEvents } from "@/lib/history";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedSellerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

type SellerTransferDetailPageProps = Readonly<{
  params: {
    id: string;
  };
}>;

export default async function SellerTransferDetailPage({ params }: SellerTransferDetailPageProps) {
  const record = await requireActivatedSellerPortalAccess();
  const transfer = await getSellerPortalTransferById(record.id, params.id);

  if (!transfer) {
    redirect("/portal/seller/transfers?error=Transfer%20not%20found.");
  }

  const historyEvents = await getTransferHistoryEvents("seller", transfer.id);

  return (
    <PortalShell
      eyebrow="Seller portal"
      title={transfer.asset_name}
      description="Seller-safe transfer detail with controlled status and closeout labels."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Transfer detail" description="This view stays sanitized and role-safe.">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
                  Contract {transfer.contract_record_id}
                </div>
                <div className="mt-1 text-sm leading-6 text-ink-600">
                  Transfer updated {new Date(transfer.transfer_updated_at).toLocaleDateString()}
                </div>
              </div>
              <div className="grid justify-items-end gap-2">
                <span className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700">
                  {portalTransferStatusLabel(transfer)}
                </span>
                <span className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
                  {portalTransferNextStepLabel(transfer)}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Stat label="Submitted" value={transfer.submitted_at ? new Date(transfer.submitted_at).toLocaleDateString() : "Not set"} />
              <Stat label="Transfer created" value={new Date(transfer.transfer_created_at).toLocaleDateString()} />
              <Stat label="Transfer updated" value={new Date(transfer.transfer_updated_at).toLocaleDateString()} />
              <Stat label="Target close" value={transfer.target_close_date ? new Date(transfer.target_close_date).toLocaleDateString() : "Not set"} />
              <Stat label="Ready" value={transfer.closeout_ready_at ? new Date(transfer.closeout_ready_at).toLocaleDateString() : "Not yet"} />
              <Stat label="Completed" value={transfer.completed_at ? new Date(transfer.completed_at).toLocaleDateString() : "Not yet"} />
              <Stat label="Archived" value={transfer.archived_at ? new Date(transfer.archived_at).toLocaleDateString() : "Not yet"} />
            </div>

            <div className="grid gap-3 rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5 text-sm leading-6 text-ink-700">
              <div>Safe next step: {transfer.next_step}</div>
              <div>Progress summary: {transfer.progress_summary}</div>
              <div>Documentation: {transfer.documentation_delivery}</div>
              <div>Support window: {transfer.support_window}</div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/portal/seller/transfers"
                className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Back to transfers
              </Link>
              {transfer.contract_id ? (
                <Link
                  href={`/portal/seller/contracts/${transfer.contract_id}`}
                  className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Open contract
                </Link>
              ) : null}
            </div>
          </div>
        </PageCard>

        <PageCard title="What the seller can see" description="The transfer surface stays safe and minimal.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Transfer record and status labels</div>
            <div>High-level readiness and closeout state</div>
            <div>Key dates without buyer identity exposure</div>
            <div>Archive status only after completion</div>
            <div>No internal notes or private buyer data</div>
          </div>
        </PageCard>

        <PageCard title="History" description="Safe seller-side transfer activity with sanitized labels and timestamps.">
          <HistoryFeed events={historyEvents} compact />
        </PageCard>
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
