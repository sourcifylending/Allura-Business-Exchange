import { SectionHeading } from "@/components/section-heading";
import { UnderwritingCard } from "@/components/underwriting-card";
import { underwritingStatusLabels, type BusinessUnderwritingRecord, type UnderwritingStatus } from "@/lib/business-underwriting";

export function UnderwritingWorkflowBoard({
  title,
  description,
  records,
}: Readonly<{
  title: string;
  description: string;
  records: BusinessUnderwritingRecord[];
}>) {
  const grouped = records.reduce<Record<UnderwritingStatus, BusinessUnderwritingRecord[]>>(
    (acc, record) => {
      acc[record.overall_underwriting_status].push(record);
      return acc;
    },
    {
      screening: [],
      reviewing: [],
      hold: [],
      approved: [],
      rejected: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Workflow" title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-5">
        {(Object.keys(underwritingStatusLabels) as UnderwritingStatus[]).map((status) => (
          <div key={status} className="rounded-[1.5rem] border border-ink-200 bg-ink-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">
                {underwritingStatusLabels[status]}
              </h3>
              <span className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700">
                {grouped[status].length}
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {grouped[status].map((record) => (
                <UnderwritingCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

