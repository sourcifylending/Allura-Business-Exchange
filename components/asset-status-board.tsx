import { AssetIntakeCard } from "@/components/asset-intake-card";
import { SectionHeading } from "@/components/section-heading";
import { assetStageLabels, type AssetIntakeRecord, type AssetStage } from "@/lib/asset-registry";

export function AssetStatusBoard({
  title,
  description,
  records,
}: Readonly<{
  title: string;
  description: string;
  records: AssetIntakeRecord[];
}>) {
  const grouped = records.reduce<Record<AssetStage, AssetIntakeRecord[]>>(
    (acc, record) => {
      const stage = inferStageFromIntake(record);
      acc[stage].push(record);
      return acc;
    },
    {
      idea: [],
      research: [],
      build: [],
      packaging: [],
      ready_to_list: [],
      listed: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Workflow" title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-3">
        {(Object.keys(assetStageLabels) as AssetStage[]).map((stage) => (
          <div key={stage} className="rounded-[1.5rem] border border-ink-200 bg-ink-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">
                {assetStageLabels[stage]}
              </h3>
              <span className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700">
                {grouped[stage].length}
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {grouped[stage].map((record) => (
                <AssetIntakeCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function inferStageFromIntake(record: AssetIntakeRecord): AssetStage {
  if (record.transfer_checklist_status === "ready") return "listed";
  if (record.transfer_checklist_status === "drafting") return "ready_to_list";
  if (record.documentation_status === "draft ready") return "packaging";
  if (record.code_repo_status === "ready") return "build";
  if (record.code_repo_status === "in_progress") return "research";
  return "idea";
}

