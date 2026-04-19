import type { DealRoomRecord } from "@/lib/deal-room";
import { DealTimelineStatusPill } from "@/components/deal-room-status-pill";

export function DealRoomTimeline({
  record,
}: Readonly<{
  record: DealRoomRecord;
}>) {
  return (
    <section className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Timeline / Milestones
      </div>
      <div className="mt-4 grid gap-3">
        {record.timeline_milestones.map((milestone) => (
          <div key={milestone.label} className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-ink-900">{milestone.label}</div>
              <DealTimelineStatusPill status={milestone.status} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

