import type { DealRoomRecord } from "@/lib/deal-room";

export function DealRoomNotes({
  record,
}: Readonly<{
  record: DealRoomRecord;
}>) {
  return (
    <section className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Notes / Q&A
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-600">{record.notes_qna_placeholder}</p>
    </section>
  );
}

