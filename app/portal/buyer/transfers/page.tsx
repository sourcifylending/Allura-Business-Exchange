import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import { PortalTransferCard } from "@/components/portal-transfer-card";
import { getBuyerTransferProgressByBuyerApplicationId } from "@/lib/closing-ops";
import { getBuyerPortalTransfers } from "@/lib/portal-transfers";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedBuyerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

export default async function BuyerTransfersPage() {
  const record = await requireActivatedBuyerPortalAccess();
  const transferProgress = await getBuyerTransferProgressByBuyerApplicationId(record.id);
  const canSeeTransfers = transferProgress?.payment_status === "payment_received";
  const transfers = canSeeTransfers ? await getBuyerPortalTransfers(record.id) : [];

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title="Buyer transfers"
      description="Controlled transfer visibility for your linked buyer chain."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PageCard title="Transfers center" description="Safe transfer progress and closeout readiness only.">
          {canSeeTransfers && transferProgress ? (
            <div className="grid gap-4">
              <div className="rounded-[1.5rem] border border-emerald-200 bg-[rgba(12,35,22,0.06)] px-4 py-3 text-sm leading-6 text-emerald-800">
                {transferProgress.buyer_visible_status}
              </div>
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
                {transfers.length > 0 ? (
                  transfers.map((transfer) => (
                    <PortalTransferCard
                      key={transfer.id}
                      record={transfer}
                      href={`/portal/buyer/transfers/${transfer.id}`}
                    />
                  ))
                ) : (
                  <div className="grid gap-3 text-sm leading-6 text-ink-700">
                    <div>No buyer transfers are linked yet.</div>
                    <div>The closing desk has not created a downstream transfer record for this buyer.</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>{transferProgress ? transferProgress.buyer_visible_status : "Transfer progress is not available yet."}</div>
              <div>
                Transfer details stay hidden until payment is marked received and Allura opens the transfer stage.
              </div>
            </div>
          )}
        </PageCard>

        <PageCard title="What appears here" description="The buyer transfer view stays sanitized and high-level.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Opportunity title and contract record reference</div>
            <div>Safe transfer status and next-step label</div>
            <div>Closeout readiness and completion dates</div>
            <div>No internal notes or private seller data</div>
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
