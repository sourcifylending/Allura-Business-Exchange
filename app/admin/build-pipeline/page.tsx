import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default function BuildPipelinePage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="AI Asset Build Pipeline"
        description="A clean pipeline shell for approved assets moving through branding, MVP build, demo prep, and packaging."
      />
      <PageCard
        title="Build board"
        description="Placeholder status columns and work items will be added later."
      />
    </div>
  );
}
