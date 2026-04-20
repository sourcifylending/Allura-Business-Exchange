import { AdminPageHeader } from "@/components/admin-page-header";
import { InquiryFormFields } from "@/components/inquiry-form-fields";
import { InquiryCard } from "@/components/inquiry-card";
import { InquiryInboxTable } from "@/components/inquiry-inbox-table";
import { InquiryStageBoard } from "@/components/inquiry-stage-board";
import { SalesOpsSummary } from "@/components/sales-ops-summary";
import { SectionHeading } from "@/components/section-heading";
import {
  attachBuyerNames,
  createInquiryRecord,
  getBuyerRecords,
  getInquiryRecords,
} from "@/lib/buyer-ops";

type InquiriesPageProps = Readonly<{
  searchParams?: {
    error?: string;
    saved?: string;
  };
}>;

export default async function InquiriesPage({ searchParams }: InquiriesPageProps) {
  const [buyerRecords, rawInquiryRecords] = await Promise.all([getBuyerRecords(), getInquiryRecords()]);
  const inquiryRecords = attachBuyerNames(rawInquiryRecords, buyerRecords);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Inquiry Inbox"
        description="Central inbox shell for inbound buyer interest and qualification status."
      />
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Inquiry {searchParams.saved === "created" ? "created" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="New Inquiry"
          title="Capture an inbound buyer lead"
          description="Add the qualification details now so the inquiry can move through triage, handoff, and close with less friction."
        />
        <form action={createInquiryRecord} className="grid gap-5">
          <InquiryFormFields buyerOptions={buyerRecords} submitLabel="Create inquiry" />
        </form>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {inquiryRecords[0] ? (
          <InquiryCard inquiry={inquiryRecords[0]} editable buyerOptions={buyerRecords} />
        ) : (
          <section className="grid gap-4 rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 p-6 text-sm leading-6 text-ink-600">
            <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
              Inquiry Inbox
            </div>
            <div className="text-xl font-semibold text-ink-950">No inquiries yet</div>
            <p>
              Add rows to the Supabase <code>inquiries</code> table to populate this shell.
            </p>
          </section>
        )}
        <SalesOpsSummary buyers={buyerRecords} inquiries={inquiryRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Inquiry Inbox"
          title="Fast-moving qualification and response triage"
          description="The inbox is structured around source, asset interest, qualification state, owner, SLA, and next step."
        />
        {inquiryRecords.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {inquiryRecords.map((inquiry) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} editable buyerOptions={buyerRecords} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            No inquiry records are loaded yet. Once rows exist in Supabase, the inquiry cards will
            appear here automatically.
          </div>
        )}
      </section>

      <InquiryStageBoard
        title="Inquiry workflow"
        description="A clear triage board for moving inquiries from inbox to qualification, handoff, and close."
        records={inquiryRecords}
        editable
        buyerOptions={buyerRecords}
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
