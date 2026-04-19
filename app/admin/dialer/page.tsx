import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default function DialerPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Dialer"
        description="Placeholder entry point for a future dialer module. No dialer logic in Phase 2."
      />
      <PageCard title="Dialer placeholder" description="Reserved for later expansion." />
    </div>
  );
}
