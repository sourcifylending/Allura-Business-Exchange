import { AdminPageHeader } from "@/components/admin-page-header";
import { BusinessIntakeCard } from "@/components/business-intake-card";
import { BusinessIntakeSummary } from "@/components/business-intake-summary";
import { BusinessIntakeWorkflowBoard } from "@/components/business-intake-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { businessIntakeRecords } from "@/lib/business-intake";

export default function BusinessSubmissionsPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Business Intake"
        description="Internal seller intake shell for secondary-lane business opportunities and review prep."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <BusinessIntakeCard record={businessIntakeRecords[0]} />
        <BusinessIntakeSummary records={businessIntakeRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Seller Intake Overview"
          title="Completeness and transferability first"
          description="Designed to show financial range, reason for sale, debt disclosures, owner involvement, and transferability before underwriting."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {businessIntakeRecords.map((record) => (
            <BusinessIntakeCard key={record.id} record={record} />
          ))}
        </div>
      </section>

      <BusinessIntakeWorkflowBoard
        title="Intake and review workflow"
        description="A clear internal view of what is new, in review, needs information, or complete."
        records={businessIntakeRecords}
      />
    </div>
  );
}
