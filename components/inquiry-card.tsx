import { InquiryFormFields } from "@/components/inquiry-form-fields";
import { InquiryStagePill, InquiryStatusPill } from "@/components/inquiry-status-pill";
import { type BuyerRecord, type InquiryRecord, updateInquiryRecord } from "@/lib/buyer-ops";

export function InquiryCard({
  inquiry,
  editable = false,
  buyerOptions = [],
}: Readonly<{
  inquiry: InquiryRecord;
  editable?: boolean;
  buyerOptions?: BuyerRecord[];
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Inquiry Inbox
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{inquiry.asset_interested_in}</h3>
          <div className="mt-1 text-sm text-ink-600">{inquiry.source}</div>
        </div>
        <InquiryStatusPill status={inquiry.qualification_status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Timestamp" value={inquiry.timestamp} />
        <Detail label="Buyer" value={inquiry.buyer_name ?? "Unassigned"} />
        <Detail label="Assigned owner" value={inquiry.assigned_owner} />
        <Detail label="Response SLA" value={inquiry.response_sla} />
        <Detail label="Next step" value={inquiry.next_step} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4">
        <InquiryStagePill stage={inquiry.stage} />
        <div className="text-sm leading-6 text-ink-700">{inquiry.notes_summary}</div>
      </div>

      {editable ? (
        <details className="mt-5 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold tracking-[0.16em] text-accent-700 uppercase">
            Edit inquiry
          </summary>
          <form action={updateInquiryRecord} className="mt-5 grid gap-5">
            <InquiryFormFields record={inquiry} buyerOptions={buyerOptions} submitLabel="Save inquiry" />
          </form>
        </details>
      ) : null}
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
