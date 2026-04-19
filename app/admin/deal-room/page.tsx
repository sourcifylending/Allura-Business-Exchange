import { AdminPageHeader } from "@/components/admin-page-header";
import { DealRoomDocumentVault } from "@/components/deal-room-document-vault";
import { DealRoomNotes } from "@/components/deal-room-notes";
import { DealRoomSummary } from "@/components/deal-room-summary";
import { DealRoomTimeline } from "@/components/deal-room-timeline";
import { DealRoomWorkflowBoard } from "@/components/deal-room-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { dealRoomRecords } from "@/lib/deal-room";

export default function DealRoomPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Deal Room"
        description="Approved-only access shell for documents, notes, milestones, and controlled visibility."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DealRoomWorkflowBoard
          title="Private access overview"
          description="A gated view of approved viewers and access status for AI assets and business opportunities."
          records={dealRoomRecords}
        />
        <DealRoomSummary records={dealRoomRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Private Access Overview"
          title="Approved-only visibility with controlled room access"
          description="This shell keeps AI asset and business deal room usage distinct while preserving sanitized public-facing behavior outside approved access."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {dealRoomRecords.map((record) => (
            <div key={record.id} className="rounded-[1.75rem] border border-ink-200 bg-ink-50 p-6">
              <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
                {record.listing_type}
              </div>
              <div className="mt-3 text-sm leading-6 text-ink-700">{record.opportunity_name}</div>
              <div className="mt-3 text-sm leading-6 text-ink-600">{record.summary_section}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <DealRoomDocumentVault record={dealRoomRecords[0]} />
        <DealRoomNotes record={dealRoomRecords[0]} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Timeline / Milestones"
          title="Diligence and transfer milestones"
          description="A placeholder timeline for access approval, document unlock, Q&A, diligence, and transfer prep."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {dealRoomRecords.map((record) => (
            <DealRoomTimeline key={record.id} record={record} />
          ))}
        </div>
      </section>
    </div>
  );
}

