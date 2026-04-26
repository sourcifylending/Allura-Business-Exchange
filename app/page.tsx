import Link from "next/link";
import { OpportunityGrid } from "@/components/opportunity-grid";
import { PageCard } from "@/components/page-card";
import { SiteShell } from "@/components/site-shell";
import { aiAssetOpportunities } from "@/lib/opportunities";

export default function HomePage() {
  return (
    <SiteShell
      eyebrow="Private Exchange"
      title="Allura Business Exchange"
      description="A curated marketplace for AI tools, digital assets, and controlled business opportunities."
    >
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <PageCard
          title="AI tools and digital assets"
          description="Primary product lane for branded listings that are easy to browse, package, and transfer."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Browse", value: "Curated listings" },
              { label: "Package", value: "Clean assets" },
              { label: "Transfer", value: "Simple handoff" },
            ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
                <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">
                  {item.label}
                </div>
                <div className="mt-2 text-sm font-medium text-ink-900">{item.value}</div>
              </div>
            ))}
          </div>
        </PageCard>
        <PageCard
          title="Buyer and seller entry points"
          description="Short paths into the catalog and public info for approved operators."
        >
          <div className="grid gap-3">
            {[
              { href: "/buyers", label: "Browse as a buyer" },
              { href: "/sellers", label: "Submit as a seller" },
              { href: "/opportunities", label: "Open the public catalog" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-medium text-ink-500 transition hover:border-accent-500 hover:text-accent-700"
              >
                <span>{item.label}</span>
                <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </PageCard>
      </div>

      {aiAssetOpportunities.length > 0 ? (
        <OpportunityGrid
          eyebrow="Featured Listings"
          title="Selected AI assets for sale"
          description="A direct preview of the primary lane, with clear pricing and branded positioning."
          opportunities={aiAssetOpportunities}
        />
      ) : (
        <section className="rounded-[2rem] border border-ink-200 bg-[rgba(17,19,22,0.92)] p-8 text-center lg:p-12">
          <div className="text-xs font-semibold tracking-[0.28em] text-ink-500 uppercase">Featured Listings</div>
          <h2 className="mt-4 text-2xl font-semibold text-ink-900">No listings currently available</h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-ink-600">
            Current opportunities are shared with qualified buyers after review. Apply below to get access to our curated deal flow.
          </p>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <PageCard
          title="How Allura works"
          description="The platform moves approved ideas from intake to listing and controlled transfer."
        >
          <div className="grid gap-3">
            {[
              "Idea intake and review",
              "Build, package, and price",
              "Public listing or teaser",
              "Buyer access and transfer",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--surface-strong))] text-xs font-semibold text-accent-700 shadow-sm">
                  0{index + 1}
                </span>
                <span className="text-sm font-medium text-ink-800">{step}</span>
              </div>
            ))}
          </div>
        </PageCard>
        <PageCard
          title="Business opportunity lane"
          description="A secondary lane for sanitized acquisitions and assignments, kept controlled by default."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">
                Public view
              </div>
              <div className="mt-2 text-sm font-medium text-ink-900">Sanitized teaser only</div>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Business details stay controlled until deeper access is approved.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">
                Future path
              </div>
              <div className="mt-2 text-sm font-medium text-ink-900">Review, NDA, handoff</div>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Controlled access is reserved for approved buyers and operators.
              </p>
            </div>
          </div>
        </PageCard>
      </div>
    </SiteShell>
  );
}
