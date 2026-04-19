import { AdminPageHeader } from "@/components/admin-page-header";
import { PackagingCard } from "@/components/packaging-card";
import { PackagingReadinessSummary } from "@/components/packaging-readiness-summary";
import { PackagingWorkflowBoard } from "@/components/packaging-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { packagingRecords } from "@/lib/packaging";

export default function PackagingPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Packaging Center"
        description="The shell for preparing assets for sale with consistent presentation and transfer readiness."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PackagingCard record={packagingRecords[0]} />
        <PackagingReadinessSummary records={packagingRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Packaging Overview"
          title="Listing prep focused on speed and clarity"
          description="Each asset needs a clear pitch, description, summary, visuals, support scope, and transfer checklist before it can move forward."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {packagingRecords.map((record) => (
            <PackagingCard key={record.id} record={record} />
          ))}
        </div>
      </section>

      <PackagingWorkflowBoard
        title="Internal listing-prep workflow"
        description="Organized by readiness state so Allura can see what is incomplete, draft ready, or approved for listing."
        records={packagingRecords}
      />
    </div>
  );
}
