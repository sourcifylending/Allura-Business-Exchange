import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";

export default function HomePage() {
  return (
    <SiteShell
      eyebrow="Private Exchange"
      title="Allura Business Exchange"
      description="A clean shell for a controlled marketplace built to move AI tools and digital assets from idea to sale."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <PageCard
          title="AI tools and digital assets"
          description="Primary focus for the homepage and future listings surface."
        />
        <PageCard
          title="How Allura works"
          description="A clear operating flow from idea intake to packaged sale and transfer."
        />
        <PageCard
          title="Active opportunities"
          description="Browsable opportunities with controlled visibility and buyer access rules."
        />
      </div>
      <PageCard
        title="Business opportunity lane"
        description="Secondary lane reserved for sanitized business acquisition and assignment opportunities."
      />
    </SiteShell>
  );
}
