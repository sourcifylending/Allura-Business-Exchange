import { DealAccessStatusPill, DealApprovalStatusPill, DealDocumentStatusPill } from "@/components/deal-room-status-pill";
import type { DealRoomRecord } from "@/lib/deal-room";

export function DealRoomCard({
  record,
}: Readonly<{
  record: DealRoomRecord;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Private Access
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{record.opportunity_name}</h3>
          <div className="mt-1 text-sm text-ink-600">
            {record.listing_type} | {record.visibility_mode}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <DealAccessStatusPill status={record.access_status} />
          <DealApprovalStatusPill status={record.approval_status} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Approved viewer" value={record.approved_viewer} />
        <Detail label="NDA required" value={record.nda_required_status} />
        <Detail label="Transfer / diligence" value={record.transfer_or_diligence_status} />
        <Detail label="Next action" value={record.next_action} />
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
        {record.summary_section}
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-ink-200 bg-white p-4">
        <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
          Documents
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {record.documents_section.map((doc) => (
            <span
              key={doc}
              className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-sm font-medium text-ink-700"
            >
              {doc}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-ink-200 bg-ink-50 p-4">
        <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
          Notes / Q&A
        </div>
        <p className="mt-3 text-sm leading-6 text-ink-600">{record.notes_qna_placeholder}</p>
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-white p-4 sm:grid-cols-2">
        <Detail label="Document vault" value={record.document_status} />
        <Detail label="Access status" value={record.access_status} />
      </div>
    </article>
  );
}

function Detail({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

