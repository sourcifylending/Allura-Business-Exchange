import { PageCard } from "@/components/page-card";
import { RiskItemCard } from "@/components/risk-item-card";
import {
  buildAdminRiskDesk,
  type AdminRiskRecord,
} from "@/lib/portal-monitoring";
import { getAdminPortalRequests } from "@/lib/portal-requests";
import { getDealLifecycleRecords } from "@/lib/deals";
import { getCloseoutDeskTransferRecords } from "@/lib/closeout-ops";

export const dynamic = "force-dynamic";

export default async function AdminRiskPage() {
  const [requests, deals, transfers] = await Promise.all([
    getAdminPortalRequests({ role: "all", requestType: "all", status: "all", state: "all" }),
    getDealLifecycleRecords(),
    getCloseoutDeskTransferRecords(),
  ]);

  const riskDesk = buildAdminRiskDesk(requests, deals, transfers);
  const stalledOffers = riskDesk.stalledDeals.filter((record) => record.stage_label === "Offer Review");
  const stalledContracts = riskDesk.stalledDeals.filter((record) => record.stage_label === "Contract");
  const stalledTransfers = riskDesk.stalledDeals.filter((record) => record.stage_label === "Transfer");

  return (
    <div className="grid gap-6">
      <PageCard title="Risk Desk" description="Operational aging view for overdue requests, stalled deals, and closeout readiness.">
        <div className="grid gap-3 sm:grid-cols-5">
          <Metric label="Overdue requests" value={String(riskDesk.summary.overdueRequests)} />
          <Metric label="Due soon" value={String(riskDesk.summary.dueSoonRequests)} />
          <Metric label="Missing docs" value={String(riskDesk.summary.missingDocumentRequests)} />
          <Metric label="Stalled deals" value={String(riskDesk.summary.stalledDeals)} />
          <Metric label="Closeout ready" value={String(riskDesk.summary.closeoutReadyTransfers)} />
        </div>
      </PageCard>

      <RiskSection
        title="Overdue requests"
        description="Requests past their due date and still open."
        records={riskDesk.overdueRequests}
        emptyMessage="No overdue requests are currently visible."
      />

      <RiskSection
        title="Open requests due soon"
        description="Controlled requests with a near-term due date."
        records={riskDesk.dueSoonRequests}
        emptyMessage="No requests are due soon."
      />

      <RiskSection
        title="Missing request-linked documents"
        description="Document requests with no uploaded file yet."
        records={riskDesk.missingDocumentRequests}
        emptyMessage="No request-linked document gaps were detected."
      />

      <RiskSection
        title="Stalled offers"
        description="Offer-stage deal chains with aging activity."
        records={stalledOffers}
        emptyMessage="No stalled offer-stage chains detected."
      />

      <RiskSection
        title="Stalled contracts"
        description="Contract-stage deal chains with aging activity."
        records={stalledContracts}
        emptyMessage="No stalled contract-stage chains detected."
      />

      <RiskSection
        title="Stalled transfers"
        description="Transfer-stage deal chains with aging activity."
        records={stalledTransfers}
        emptyMessage="No stalled transfer-stage chains detected."
      />

      <RiskSection
        title="Closeout-ready transfers"
        description="Transfers that have reached closeout readiness or are awaiting archive completion."
        records={riskDesk.closeoutReadyTransfers}
        emptyMessage="No closeout-ready transfers are waiting."
      />
    </div>
  );
}

function RiskSection({
  title,
  description,
  records,
  emptyMessage,
}: Readonly<{
  title: string;
  description: string;
  records: AdminRiskRecord[];
  emptyMessage: string;
}>) {
  return (
    <PageCard title={title} description={description}>
      {records.length > 0 ? (
        <div className="grid gap-4">
          {records.map((record) => (
            <RiskItemCard key={record.key} record={record} href={record.href} />
          ))}
        </div>
      ) : (
        <div className="grid gap-2 text-sm leading-6 text-ink-700">
          <div>{emptyMessage}</div>
          <div>The risk desk only shows items that are actually aging or incomplete.</div>
        </div>
      )}
    </PageCard>
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
