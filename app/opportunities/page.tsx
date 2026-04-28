import { SiteShell } from "@/components/site-shell";
import { OpportunityGrid } from "@/components/opportunity-grid";
import { createClient } from "@/lib/supabase/server";
import type { DigitalAssetRow } from "@/lib/supabase/database.types";

export default async function OpportunitiesPage() {
  const supabase = createClient();

  // Fetch public digital assets from database
  const { data: publicAssets } = await supabase
    .from("digital_assets")
    .select("id, name, asking_price, short_description, visibility, asset_type, status") as unknown as { data: DigitalAssetRow[] | null };

  // Separate AI assets from others
  const aiAssets = (publicAssets || [])
    .filter((asset: DigitalAssetRow) => asset.asset_type === "ai")
    .map((asset) => ({
      listing_type: "ai_asset" as const,
      visibility_mode: "fully_public" as const,
      title_public: asset.name,
      title_private: asset.name,
      brand_name: asset.name,
      short_description: asset.short_description || "AI asset for sale",
      asking_price: asset.asking_price ? `$${asset.asking_price.toLocaleString()}` : "Contact for pricing",
      price_range: "",
      status: "live" as const,
      cover_image: "Asset preview",
      region: "Remote",
      category: "AI Tool",
      nda_required: false,
      published: true,
    }));

  const businessAssets = (publicAssets || [])
    .filter((asset: DigitalAssetRow) => asset.asset_type !== "ai")
    .map((asset) => ({
      listing_type: "business" as const,
      visibility_mode: "fully_public" as const,
      title_public: asset.name,
      title_private: asset.name,
      brand_name: asset.name,
      short_description: asset.short_description || "Business opportunity",
      asking_price: asset.asking_price ? `$${asset.asking_price.toLocaleString()}` : "Contact for pricing",
      price_range: "",
      status: "live" as const,
      cover_image: "Opportunity preview",
      region: "Various",
      category: "Business",
      nda_required: true,
      published: true,
    }));

  return (
    <SiteShell
      eyebrow="Opportunities"
      title="Active opportunities"
      description="Browse public opportunities from our curated selection."
    >
      <div className="grid gap-10">
        {aiAssets.length > 0 && (
          <OpportunityGrid
            eyebrow="Primary"
            title="AI asset listings"
            description="Branded digital assets are the main product focus and are shown publicly with clear pricing and positioning."
            opportunities={aiAssets}
          />
        )}

        {businessAssets.length > 0 && (
          <OpportunityGrid
            eyebrow="Secondary"
            title="Business opportunities"
            description="Operating businesses and acquisition opportunities shown to qualified buyers."
            opportunities={businessAssets}
          />
        )}

        {aiAssets.length === 0 && businessAssets.length === 0 && (
          <section className="rounded-[1.75rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-8 text-center">
            <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
              No Current Listings
            </div>
            <div className="mt-4 text-xl font-semibold text-ink-900">
              Private opportunities available by invitation
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-ink-600">
              Qualified buyers receive direct invitations to review curated opportunities. Apply below to get access to our exclusive deal flow.
            </p>
          </section>
        )}

        <section className="rounded-[1.75rem] border border-dashed border-ink-200 bg-[rgba(18,20,23,0.96)] p-6">
          <div className="text-xs font-semibold tracking-[0.28em] text-ink-500 uppercase">
            Ready to participate?
          </div>
          <div className="mt-2 text-lg font-semibold text-ink-950">
            Apply as a buyer to unlock exclusive opportunities
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
            Qualified buyers receive direct access to our curated selection of high-value opportunities before they're widely marketed.
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
