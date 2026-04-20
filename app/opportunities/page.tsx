import { SiteShell } from "@/components/site-shell";
import { OpportunityGrid } from "@/components/opportunity-grid";
import { aiAssetOpportunities, businessTeaserOpportunities } from "@/lib/opportunities";

export default function OpportunitiesPage() {
  return (
    <SiteShell
      eyebrow="Opportunities"
      title="Active opportunities"
      description="A browsable feed that keeps AI asset listings visible by default while sanitizing business teasers."
    >
      <div className="grid gap-10">
        <OpportunityGrid
          eyebrow="Primary"
          title="AI asset listings"
          description="Branded digital assets are the main product focus and are shown publicly with clear pricing and positioning."
          opportunities={aiAssetOpportunities}
        />
        <OpportunityGrid
          eyebrow="Secondary"
          title="Business teasers"
          description="Operating businesses stay sanitized by default and only expose limited public details."
          opportunities={businessTeaserOpportunities}
        />
        <section className="rounded-[1.75rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-6 shadow-soft">
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Free Account Feed Shell
          </div>
          <div className="mt-2 text-lg font-semibold text-ink-950">
            Same catalog surface, later with saved opportunities and request access actions
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
            This shell is intentionally static for Phase 3. It sets up the browsing structure for
            free-account users without introducing auth or inquiry logic.
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
