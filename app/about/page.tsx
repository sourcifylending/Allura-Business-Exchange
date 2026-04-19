import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";

export default function AboutPage() {
  return (
    <SiteShell
      eyebrow="About"
      title="A controlled exchange, not a public board"
      description="Allura is designed to manage intake, packaging, visibility, and deal flow for high-speed asset sales."
    >
      <PageCard
        title="Controlled intake"
        description="Allura approves what gets built and what gets listed."
      />
    </SiteShell>
  );
}
