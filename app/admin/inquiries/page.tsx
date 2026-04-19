import { AdminPageHeader } from "@/components/admin-page-header";
import { InquiryCard } from "@/components/inquiry-card";
import { InquiryInboxTable } from "@/components/inquiry-inbox-table";
import { InquiryStageBoard } from "@/components/inquiry-stage-board";
import { SalesOpsSummary } from "@/components/sales-ops-summary";
import { SectionHeading } from "@/components/section-heading";
import { buyerRecords, inquiryRecords } from "@/lib/buyer-ops";

export default function InquiriesPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Inquiry Inbox"
        description="Central inbox shell for inbound buyer interest and qualification status."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <InquiryCard inquiry={inquiryRecords[0]} />
        <SalesOpsSummary buyers={buyerRecords} inquiries={inquiryRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Inquiry Inbox"
          title="Fast-moving qualification and response triage"
          description="The inbox is structured around source, asset interest, qualification state, owner, SLA, and next step."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {inquiryRecords.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      </section>

      <InquiryStageBoard
        title="Inquiry workflow"
        description="A clear triage board for moving inquiries from inbox to qualification, handoff, and close."
        records={inquiryRecords}
      />

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Inbox Table"
          title="Operational view for quick scanning"
          description="The table view makes it easier to scan source, status, SLA, and ownership across active inquiries."
        />
        <InquiryInboxTable records={inquiryRecords} />
      </section>
    </div>
  );
}
