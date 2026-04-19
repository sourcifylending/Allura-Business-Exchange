import { AdminPageHeader } from "@/components/admin-page-header";
import { UnderwritingCard } from "@/components/underwriting-card";
import { UnderwritingSummary } from "@/components/underwriting-summary";
import { UnderwritingWorkflowBoard } from "@/components/underwriting-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { underwritingRecords } from "@/lib/business-underwriting";

export default function UnderwritingPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Underwriting"
        description="Internal evaluation shell for business quality, transferability, and spread potential."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <UnderwritingCard record={underwritingRecords[0]} />
        <UnderwritingSummary records={underwritingRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Underwriting Overview"
          title="Deal quality, transferability, and risk first"
          description="The goal is to surface debt, owner dependence, margin quality, and spread potential before any later buyer presentation work."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {underwritingRecords.map((record) => (
            <UnderwritingCard key={record.id} record={record} />
          ))}
        </div>
      </section>

      <UnderwritingWorkflowBoard
        title="Underwriting workflow"
        description="A stage-oriented view for screening, reviewing, holding, approving, or rejecting business opportunities."
        records={underwritingRecords}
      />
    </div>
  );
}
