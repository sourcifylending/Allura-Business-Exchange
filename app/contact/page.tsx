import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";

export default function ContactPage() {
  return (
    <SiteShell
      eyebrow="Contact"
      title="Talk to the Allura team"
      description="A simple contact entry point for buyers, sellers, and future approvals."
    >
      <PageCard
        title="Contact shell"
        description="Forms and submission handling are deferred to later phases."
      />
    </SiteShell>
  );
}
