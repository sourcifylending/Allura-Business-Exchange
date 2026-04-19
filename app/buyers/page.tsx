import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";

export default function BuyersPage() {
  return (
    <SiteShell
      eyebrow="Buyers"
      title="For buyers who want speed and clarity"
      description="Free accounts can browse, save opportunities, and request deeper access where required."
    >
      <PageCard
        title="Buyer access"
        description="Buyer intake and qualification will be added in later phases."
      />
    </SiteShell>
  );
}
