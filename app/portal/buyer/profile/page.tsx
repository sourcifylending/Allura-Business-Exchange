import { PageCard } from "@/components/page-card";
import { PortalAccessSummary } from "@/components/portal-access-summary";
import { PortalShell } from "@/components/portal-shell";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireBuyerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

export default async function BuyerProfilePage() {
  const record = await requireBuyerPortalAccess();

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title="Buyer profile"
      description="Read-only profile summary for the invited buyer account."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      <PortalAccessSummary
        title="Buyer profile details"
        description="Profile editing is intentionally read-only in this phase."
        record={record}
        accountTypeLabel="Buyer portal"
        summaryItems={[
          { label: "Buyer type", value: record.buyer_type },
          { label: "Budget", value: record.budget_range },
          { label: "Niches of interest", value: record.niches_of_interest.join(", ") || "None" },
          { label: "Asset preferences", value: record.asset_preferences.join(", ") || "None" },
          { label: "Proof of funds", value: record.proof_of_funds_status },
          { label: "Urgency", value: record.urgency },
        ]}
      />

      <PageCard title="Profile edit status" description="Portal profile edits are deferred until the model is ready.">
        <div className="grid gap-3 text-sm leading-6 text-ink-700">
          <div>Linked application data remains the source of truth.</div>
          <div>Approval, invite, and access metadata stay locked down.</div>
          <div>Profile editing will be added only if it can be done safely later.</div>
        </div>
      </PageCard>
    </PortalShell>
  );
}
