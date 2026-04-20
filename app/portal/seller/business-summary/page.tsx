import { PageCard } from "@/components/page-card";
import { PortalAccessSummary } from "@/components/portal-access-summary";
import { PortalShell } from "@/components/portal-shell";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireSellerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

export default async function SellerBusinessSummaryPage() {
  const record = await requireSellerPortalAccess();

  return (
    <PortalShell
      eyebrow="Seller portal"
      title="Business summary"
      description="Controlled business-summary foundation for the invited seller account."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      <PortalAccessSummary
        title="Business summary"
        description="This page keeps the seller-side business context visible without exposing admin data."
        record={record}
        accountTypeLabel="Seller portal"
        summaryItems={[
          { label: "Business name", value: record.business_name },
          { label: "Industry", value: record.industry },
          { label: "Website", value: record.website || "Not provided" },
          { label: "Asset type", value: record.asset_type },
          { label: "Reason for selling", value: record.reason_for_selling },
        ]}
      />

      <PageCard title="Review progress" description="A seller-side summary of what comes next.">
        <div className="grid gap-3 text-sm leading-6 text-ink-700">
          <div>Listing readiness checks will appear here later.</div>
          <div>Documents and packaging will be surfaced when ready.</div>
          <div>Internal admin review data stays hidden.</div>
        </div>
      </PageCard>
    </PortalShell>
  );
}
