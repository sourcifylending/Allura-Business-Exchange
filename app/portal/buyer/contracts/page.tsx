import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import { PortalContractCard } from "@/components/portal-contract-card";
import { getBuyerPortalContracts } from "@/lib/portal-contracts";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedBuyerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

export default async function BuyerContractsPage() {
  const record = await requireActivatedBuyerPortalAccess();
  const contracts = await getBuyerPortalContracts(record.id);

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title="Buyer contracts"
      description="Controlled contract visibility for your linked buyer chain."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PageCard title="Contracts center" description="Safe contract progress and transfer readiness only.">
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
                  value={
                    contracts.filter(
                      (contract) => contract.portal_status === "in_review" || contract.portal_status === "awaiting_admin",
                    ).length
                  }
                />
              </div>
              <div className="grid gap-4">
                {contracts.map((contract) => (
                  <PortalContractCard
                    key={contract.id}
                    record={contract}
                    href={`/portal/buyer/contracts/${contract.id}`}
                    transferHref={contract.transfer_row_id ? `/portal/buyer/transfers/${contract.transfer_row_id}` : undefined}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>No buyer contracts are linked yet.</div>
              <div>Qualified offers will surface here when admin advances them into contract workflow.</div>
            </div>
          )}
        </PageCard>

        <PageCard title="What appears here" description="The buyer view stays sanitized and high-level.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Contract title and record ID</div>
            <div>Safe status and next-step label</div>
            <div>Document and transfer readiness labels</div>
            <div>Key dates and linked opportunity reference</div>
          </div>
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
  value: number;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink-950">{value}</div>
    </div>
  );
}
