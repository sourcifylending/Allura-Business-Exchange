import { SectionHeading } from "@/components/section-heading";
import { DealRoomCard } from "@/components/deal-room-card";
import { type DealRoomRecord, type AccessStatus } from "@/lib/deal-room";

export function DealRoomWorkflowBoard({
  title,
  description,
  records,
}: Readonly<{
  title: string;
  description: string;
  records: DealRoomRecord[];
}>) {
  const grouped = records.reduce<Record<AccessStatus, DealRoomRecord[]>>(
    (acc, record) => {
      acc[record.access_status].push(record);
      return acc;
    },
    {
      pending: [],
      approved: [],
      restricted: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Workflow" title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-3">
        {(Object.keys(grouped) as AccessStatus[]).map((status) => (
          <div key={status} className="rounded-[1.5rem] border border-ink-200 bg-ink-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">
                {status}
              </h3>
              <span className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700">
                {grouped[status].length}
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {grouped[status].map((record) => (
                <DealRoomCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

