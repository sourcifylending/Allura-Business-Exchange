import Link from "next/link";
import { redirect } from "next/navigation";
import { PageCard } from "@/components/page-card";
import { HistoryFeed } from "@/components/history-feed";
import { PortalShell } from "@/components/portal-shell";
import {
  getBuyerPortalContractById,
  portalContractNextStepLabel,
  portalContractStatusLabel,
} from "@/lib/portal-contracts";
import { getContractHistoryEvents } from "@/lib/history";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedBuyerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

type BuyerContractDetailPageProps = Readonly<{
  params: {
    id: string;
  };
}>;

export default async function BuyerContractDetailPage({ params }: BuyerContractDetailPageProps) {
  const record = await requireActivatedBuyerPortalAccess();
  const contract = await getBuyerPortalContractById(record.id, params.id);

  if (!contract) {
    redirect("/portal/buyer/contracts?error=Contract%20not%20found.");
  }

  const historyEvents = await getContractHistoryEvents("buyer", contract.id);

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title={contract.asset_name}
      description="Buyer-safe contract detail with controlled status and next-step labels."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Contract detail" description="This view stays sanitized and role-safe.">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
                  {contract.contract_type}
                </div>
                <div className="mt-1 text-sm leading-6 text-ink-600">Record {contract.contract_record_id}</div>
              </div>
              <div className="grid justify-items-end gap-2">
                <span className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700">
                  {portalContractStatusLabel(contract)}
                </span>
                <span className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
                  {portalContractNextStepLabel(contract)}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Stat label="Document status" value={contract.document_status} />
              <Stat label="Sent date" value={new Date(contract.sent_date).toLocaleDateString()} />
              <Stat
                label="Submitted"
                value={contract.submitted_at ? new Date(contract.submitted_at).toLocaleDateString() : "Not set"}
              />
              <Stat
                label="Updated"
                value={new Date(contract.contract_updated_at).toLocaleDateString()}
              />
              <Stat label="Offer amount" value={contract.offer_amount ?? "Not set"} />
              <Stat
                label="Transfer"
                value={contract.transfer_status ? contract.transfer_status.replaceAll("_", " ") : "Not linked"}
              />
            </div>

            <div className="grid gap-3 rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5 text-sm leading-6 text-ink-700">
              <div>Safe next step: {contract.safe_next_step}</div>
              <div>Structure: {contract.structure_preference ?? "Not set"}</div>
              <div>Financing: {contract.financing_plan ?? "Not set"}</div>
              <div>Target close: {contract.target_close_date ? new Date(contract.target_close_date).toLocaleDateString() : "Not set"}</div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/portal/buyer/contracts"
                className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Back to contracts
              </Link>
              {contract.transfer_row_id ? (
                <Link
                  href={`/portal/buyer/transfers/${contract.transfer_row_id}`}
                  className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Open transfer
                </Link>
              ) : null}
              {contract.packaging_id ? (
                <Link
                  href={`/portal/buyer/opportunities/${contract.packaging_id}`}
                  className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Open opportunity
                </Link>
              ) : null}
              {contract.submission_id ? (
                <Link
                  href={`/portal/buyer/offers/${contract.submission_id}`}
                  className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Open offer submission
                </Link>
              ) : null}
            </div>
          </div>
        </PageCard>

        <PageCard title="What the buyer can see" description="The contract surface stays safe and minimal.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Contract record and status labels</div>
            <div>High-level readiness and transfer state</div>
            <div>Key dates and linked opportunity reference</div>
            <div>No internal notes or private seller data</div>
          </div>
        </PageCard>

        <PageCard title="History" description="Safe buyer-side contract activity with sanitized labels and timestamps.">
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
