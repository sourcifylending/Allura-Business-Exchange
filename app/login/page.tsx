import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";

export default function LoginPage() {
  return (
    <SiteShell
      eyebrow="Login"
      title="Placeholder sign-in entry point"
      description="Authentication is not implemented in Phase 1. This route exists as a shell only."
    >
      <PageCard
        title="Access placeholder"
        description="Auth wiring is intentionally out of scope for this phase."
      />
    </SiteShell>
  );
}
