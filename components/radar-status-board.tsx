import { RadarIdeaCard } from "@/components/radar-idea-card";
import { SectionHeading } from "@/components/section-heading";
import { radarStatusLabels, type RadarRecord, type RadarStatus } from "@/lib/market-radar";

export function RadarStatusBoard({
  title,
  description,
  records,
}: Readonly<{
  title: string;
  description: string;
  records: RadarRecord[];
}>) {
  const grouped = records.reduce<Record<RadarStatus, RadarRecord[]>>(
    (acc, record) => {
      acc[record.status].push(record);
      return acc;
    },
    {
      idea: [],
      researching: [],
      approved: [],
      rejected: [],
      later: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Status Board" title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-5">
        {(Object.keys(radarStatusLabels) as RadarStatus[]).map((status) => (
          <div key={status} className="rounded-[1.5rem] border border-ink-200 bg-ink-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">
                {radarStatusLabels[status]}
              </h3>
              <span className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700">
                {grouped[status].length}
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {grouped[status].map((record) => (
                <RadarIdeaCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

