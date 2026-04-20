import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";

export default function HowItWorksPage() {
  return (
    <SiteShell
      eyebrow="How It Works"
      title="From idea to sale, with controlled visibility"
      description="The platform is structured to move approved ideas through build, packaging, listing, qualification, and transfer."
    >
      <PageCard
        title="Flow"
        description="Idea -> validation -> build -> package -> list -> qualify buyer -> sell -> transfer."
      />
    </SiteShell>
  );
}
