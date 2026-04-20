import type { InquiryRecord, InquiryStage } from "@/lib/buyer-ops";
import { InquiryStatusPill } from "@/components/inquiry-status-pill";
import { inquiryStageLabels } from "@/lib/buyer-ops";

export function InquiryInboxTable({
  records,
}: Readonly<{
  records: InquiryRecord[];
}>) {
  if (records.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
        No inquiries are loaded yet. Once rows exist in Supabase, the inbox table will appear here
        automatically.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-ink-200 bg-white shadow-soft">
      <table className="w-full border-collapse">
        <thead className="bg-ink-50">
          <tr className="text-left text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">
            <Th>Source</Th>
            <Th>Asset</Th>
            <Th>Status</Th>
            <Th>Stage</Th>
            <Th>Owner / SLA</Th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-t border-ink-200 align-top">
              <Td>
                <div className="font-semibold text-ink-950">{record.source}</div>
                <div className="mt-1 text-xs tracking-[0.16em] text-ink-500 uppercase">
                  {record.timestamp}
                </div>
              </Td>
              <Td>
                <div className="text-sm font-medium text-ink-900">{record.asset_interested_in}</div>
                <div className="mt-1 text-xs tracking-[0.16em] text-ink-500 uppercase">
                  Buyer: {record.buyer_name ?? "Unassigned"}
                </div>
                <div className="mt-2 text-sm text-ink-600">{record.notes_summary}</div>
              </Td>
              <Td>
                <InquiryStatusPill status={record.qualification_status} />
              </Td>
              <Td>
                <Badge>{inquiryStageLabels[record.stage as InquiryStage]}</Badge>
              </Td>
              <Td>
                <div className="text-sm text-ink-700">{record.assigned_owner}</div>
                <div className="mt-1 text-sm text-ink-700">{record.response_sla}</div>
                <div className="mt-1 text-sm text-ink-700">{record.next_step}</div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: Readonly<{ children: React.ReactNode }>) {
  return <th className="px-5 py-4">{children}</th>;
}

function Td({ children }: Readonly<{ children: React.ReactNode }>) {
  return <td className="px-5 py-5">{children}</td>;
}

function Badge({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span className="inline-flex rounded-full border border-accent-200 bg-[rgb(var(--accent-soft))] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-accent-800 uppercase">
      {children}
    </span>
  );
}
