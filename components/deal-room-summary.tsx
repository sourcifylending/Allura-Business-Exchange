import { RadarScorePill } from "@/components/radar-score-pill";
import type { DealRoomRecord } from "@/lib/deal-room";

export function DealRoomSummary({
  records,
}: Readonly<{
  records: DealRoomRecord[];
}>) {
  const approved = records.filter((record) => record.access_status === "approved").length;
  const business = records.filter((record) => record.listing_type === "business").length;
  const locked = records.filter((record) => record.document_status === "locked").length;

  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Gated Access Snapshot
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <RadarScorePill label="Approved" value={approved} tone="positive" />
        <RadarScorePill label="Business Rooms" value={business} tone="warning" />
        <RadarScorePill label="Locked Docs" value={locked} tone="danger" />
      </div>
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
        This shell distinguishes approved access from public visibility without implementing auth.
      </div>
    </section>
  );
}

