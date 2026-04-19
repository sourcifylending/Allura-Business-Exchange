import { SiteShell } from "@/components/site-shell";
import { OpportunityGrid } from "@/components/opportunity-grid";
import { aiAssetOpportunities } from "@/lib/opportunities";

export default function DigitalAssetsPage() {
  return (
    <SiteShell
      eyebrow="Digital Assets"
      title="AI tools and software assets"
      description="Primary listing lane for pre-revenue AI tools, micro SaaS, automations, and other transferable digital assets."
    >
      <OpportunityGrid
        eyebrow="Public Listings"
        title="Branded AI asset cards"
        description="These listings stay front and center and show the product name, brand, pricing, and value proposition."
        opportunities={aiAssetOpportunities}
      />
    </SiteShell>
  );
}
