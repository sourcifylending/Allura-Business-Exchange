import { redirect } from "next/navigation";
import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import { requireBuyerPortalAccess } from "@/lib/portal-access";
import { getBuyerTransferProgressByBuyerApplicationId } from "@/lib/closing-ops";
import { portalNavItemsForRole } from "@/lib/portal-navigation";

export const dynamic = "force-dynamic";

type BuyerPortalPageProps = Readonly<{
  searchParams?: {
    error?: string;
    token?: string;
  };
}>;

export default async function BuyerPortalPage({ searchParams }: BuyerPortalPageProps) {
  if (searchParams?.token) {
    redirect(`/buyer-invite?token=${encodeURIComponent(searchParams.token)}`);
  }

  const record = await requireBuyerPortalAccess();
  const transferProgress = await getBuyerTransferProgressByBuyerApplicationId(record.id);
  const canSeeTransferProgress = transferProgress?.payment_status === "payment_received";

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title="Buyer dashboard"
      description="Controlled access for your linked buyer account."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-[rgba(52,18,26,0.96)] px-5 py-4 text-sm font-medium text-rose-700">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PageCard title="Account status" description="Your buyer record controls what appears in the portal.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Buyer name: {record.applicant_name}</div>
            <div>Buyer email: {record.email}</div>
            <div>Application status: {record.status}</div>
            <div>Proof of funds: {record.proof_of_funds_status}</div>
            <div>Invited at: {record.invited_at || "Not yet invited"}</div>
          </div>
        </PageCard>

        <PageCard title="Next steps" description="Activated accounts can review controlled materials below.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            {record.status === "activated" ? (
              <>
                <div>Review opportunities that are visible to your account</div>
                <div>Open documents that have been released to the buyer portal</div>
                <div>Track requests, offers, contracts, and transfers from the sidebar</div>
              </>
            ) : (
              <>
                <div>Your portal invite has not been fully activated yet.</div>
                <div>Open the buyer invite link from your email and sign the NDA to unlock access.</div>
              </>
            )}
          </div>
        </PageCard>
      </div>

      <div className="grid gap-6">
        <PageCard title="Transfer Progress" description="Controlled transfer visibility for your assigned asset.">
          {canSeeTransferProgress && transferProgress ? (
            <div className="grid gap-4 text-sm leading-6 text-ink-700">
              <div className="rounded-[1.5rem] border border-emerald-200 bg-[rgba(12,35,22,0.06)] px-4 py-3 text-emerald-800">
                {transferProgress.buyer_visible_status}
              </div>

              <div className="grid gap-3">
                <SectionRow label="Deal Status" value={transferProgress.closing_status.replaceAll("_", " ")} />
                <SectionRow label="Purchase Agreement Status" value={transferProgress.purchase_agreement_status.replaceAll("_", " ")} />
                <SectionRow label="Payment Status" value={transferProgress.payment_status.replaceAll("_", " ")} />
              </div>

              <div className="grid gap-2">
                <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Progress tracker</div>
                <div className="grid gap-2">
                  {transferProgress.progress_steps.map((step) => (
                    <div
                      key={step.label}
                      className={[
                        "rounded-2xl border px-4 py-3 text-sm font-semibold",
                        step.status === "complete"
                          ? "border-emerald-200 bg-[rgba(12,35,22,0.06)] text-emerald-800"
                          : step.status === "current"
                            ? "border-accent-200 bg-[rgba(160,120,50,0.12)] text-accent-800"
                            : "border-ink-200 bg-[rgb(var(--surface))] text-ink-600",
                      ].join(" ")}
                    >
                      {step.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5">
                <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Next Required Buyer Action</div>
                <div>{transferProgress.next_required_buyer_action}</div>
                <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Allura Transition Notes</div>
                <div>{transferProgress.transition_notes}</div>
              </div>

              <div className="grid gap-3">
                <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Buyer-visible checklist</div>
                {transferProgress.visible_checklist_items.length > 0 ? (
                  transferProgress.visible_checklist_items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
                      <div className="font-semibold text-ink-950">{item.buyer_visible_label}</div>
                      <div className="mt-1 text-ink-600">Status: {item.status.replaceAll("_", " ")}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] p-4 text-ink-600">
                    Buyer-visible transfer checklist items will appear when Allura releases them.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>
                {transferProgress
                  ? transferProgress.buyer_visible_status
                  : "Your transfer progress will appear here once Allura creates the closing record."}
              </div>
              <div>{transferProgress ? "Payment confirmation is required before transfer progress is shown." : "No transfer steps are visible yet."}</div>
            </div>
          )}
        </PageCard>
      </div>
    </PortalShell>
  );
}

function SectionRow({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}
