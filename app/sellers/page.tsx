import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";

export default function SellersPage() {
  return (
    <SiteShell
      eyebrow="Sellers"
      title="For asset owners and opportunity submitters"
      description="This shell supports controlled submissions for digital assets and selected business opportunities."
    >
      <PageCard
        title="Submission path"
        description="Seller intake and approval workflows are reserved for later phases."
      />
    </SiteShell>
  );
}
