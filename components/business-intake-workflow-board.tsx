import { BusinessIntakeCard } from "@/components/business-intake-card";
import { SectionHeading } from "@/components/section-heading";
import { intakeStatusLabels, reviewStatusLabels, type BusinessIntakeRecord, type IntakeStatus, type ReviewStatus } from "@/lib/business-intake";

export function BusinessIntakeWorkflowBoard({
  title,
  description,
  records,
}: Readonly<{
  title: string;
  description: string;
  records: BusinessIntakeRecord[];
}>) {
  const groupedByIntake = records.reduce<Record<IntakeStatus, BusinessIntakeRecord[]>>(
    (acc, record) => {
      acc[record.intake_status].push(record);
      return acc;
    },
    {
      new: [],
      in_review: [],
      needs_info: [],
      complete: [],
    },
  );

  const groupedByReview = records.reduce<Record<ReviewStatus, BusinessIntakeRecord[]>>(
    (acc, record) => {
      acc[record.review_status].push(record);
      return acc;
    },
    {
      pending: [],
      clear: [],
      red_flags: [],
      hold: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Workflow" title={title} description={description} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Board
          title="Intake Status"
          labels={intakeStatusLabels}
          groups={groupedByIntake}
          items={records}
        />
        <Board
          title="Review Status"
          labels={reviewStatusLabels}
          groups={groupedByReview}
          items={records}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {records.map((record) => (
          <BusinessIntakeCard key={record.id} record={record} />
        ))}
      </div>
    </section>
  );
}

function Board<T extends string>({
  title,
  labels,
  groups,
  items,
}: Readonly<{
  title: string;
  labels: Record<T, string>;
  groups: Record<T, BusinessIntakeRecord[]>;
  items: BusinessIntakeRecord[];
}>) {
  return (
    <div className="rounded-[1.75rem] border border-ink-200 bg-ink-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">{title}</h3>
        <span className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700">
          {items.length}
        </span>
      </div>
      <div className="mt-4 grid gap-3">
        {(Object.keys(labels) as T[]).map((status) => (
          <div key={status} className="rounded-2xl border border-ink-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                {labels[status]}
              </div>
              <span className="rounded-full border border-ink-200 bg-ink-50 px-2 py-0.5 text-xs font-semibold text-ink-700">
                {groups[status].length}
              </span>
            </div>
            <div className="mt-3 text-sm leading-6 text-ink-600">
              {groups[status].map((record) => record.legal_business_name).join(", ") || "None"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

