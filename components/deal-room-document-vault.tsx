import type { DealRoomRecord } from "@/lib/deal-room";
import { DealDocumentStatusPill } from "@/components/deal-room-status-pill";

export function DealRoomDocumentVault({
  record,
}: Readonly<{
  record: DealRoomRecord;
}>) {
  return (
    <section className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Document Vault
          </div>
          <div className="mt-1 text-lg font-semibold text-ink-950">Placeholder vault</div>
        </div>
        <DealDocumentStatusPill status={record.document_status} />
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
    </section>
  );
}

