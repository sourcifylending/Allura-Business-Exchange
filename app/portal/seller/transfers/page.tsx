import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import { PortalTransferCard } from "@/components/portal-transfer-card";
import { getSellerPortalTransfers } from "@/lib/portal-transfers";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedSellerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

export default async function SellerTransfersPage() {
  const record = await requireActivatedSellerPortalAccess();
  const transfers = await getSellerPortalTransfers(record.id);

  return (
    <PortalShell
      eyebrow="Seller portal"
      title="Seller transfers"
      description="Controlled transfer visibility for your linked seller chain."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PageCard title="Transfers center" description="Safe transfer progress and closeout readiness only.">
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
                {transfers.map((transfer) => (
                  <PortalTransferCard
                    key={transfer.id}
                    record={transfer}
                    href={`/portal/seller/transfers/${transfer.id}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>No seller transfers are linked yet.</div>
              <div>Transfers appear here when contracts move into closeout readiness.</div>
            </div>
          )}
        </PageCard>

        <PageCard title="What appears here" description="The seller transfer view stays sanitized and high-level.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Opportunity title and contract record reference</div>
            <div>Safe transfer status and next-step label</div>
            <div>Closeout readiness and completion dates</div>
            <div>No internal notes or private buyer data</div>
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
