import { PageCard } from "@/components/page-card";
import { PortalAccessSummary } from "@/components/portal-access-summary";
import { PortalShell } from "@/components/portal-shell";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireSellerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

export default async function SellerProfilePage() {
  const record = await requireSellerPortalAccess();

  return (
    <PortalShell
      eyebrow="Seller portal"
      title="Seller profile"
      description="Read-only profile summary for the invited seller account."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      <PortalAccessSummary
        title="Seller profile details"
        description="Profile editing is intentionally read-only in this phase."
        record={record}
        accountTypeLabel="Seller portal"
        summaryItems={[
          { label: "Business name", value: record.business_name },
          { label: "Website", value: record.website || "Not provided" },
          { label: "Industry", value: record.industry },
          { label: "Asset type", value: record.asset_type },
          { label: "Asking range", value: record.asking_price_range },
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
