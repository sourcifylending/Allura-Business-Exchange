import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";

export default function AboutPage() {
  return (
    <SiteShell
      eyebrow="About"
      title="A controlled exchange for curated deals"
      description="Allura is built to manage intake, packaging, visibility, and deal flow for faster asset sales."
    >
      <PageCard
        title="Controlled intake"
        description="Allura approves what gets built, packaged, and listed."
      />
    </SiteShell>
  );
}
