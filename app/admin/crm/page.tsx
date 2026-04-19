import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default function CrmPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="CRM"
        description="Placeholder entry point for a future CRM module. No CRM logic in Phase 2."
      />
      <PageCard title="CRM placeholder" description="Reserved for later expansion." />
    </div>
  );
}
