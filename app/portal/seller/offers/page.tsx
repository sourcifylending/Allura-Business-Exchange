import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import { SellerOfferActivityCard } from "@/components/seller-offer-activity-card";
import { getSellerPortalOfferActivity } from "@/lib/seller-offers";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedSellerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

export default async function SellerOffersPage() {
  const record = await requireActivatedSellerPortalAccess();
  const activity = await getSellerPortalOfferActivity(record.id);

  return (
    <PortalShell
      eyebrow="Seller portal"
      title="Offer activity"
      description="Controlled inbound offer activity for your linked seller opportunities."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard
          title="Inbound offer activity"
          description="Only sanitized activity tied to your linked seller opportunities is shown here."
        >
          {activity.length > 0 ? (
            <div className="grid gap-4">
              {activity.map((record) => (
                <SellerOfferActivityCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>No seller offer activity is available yet.</div>
              <div>When linked opportunities receive buyer interest, the activity will appear here.</div>
            </div>
          )}
        </PageCard>

        <div className="grid gap-6">
          <PageCard title="What is shown" description="Buyer identity and direct contact stay hidden.">
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>Opportunity title and safe summary only</div>
              <div>Offer activity counts and high-level state</div>
              <div>Converted/internal-link status when applicable</div>
            </div>
          </PageCard>
        </div>
      </div>
    </PortalShell>
  );
}
