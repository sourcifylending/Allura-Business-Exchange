import { PackagingCard } from "@/components/packaging-card";
import { SectionHeading } from "@/components/section-heading";
import type { PackagingRecord } from "@/lib/packaging";
import { packagingStatusLabels, type PackagingStatus, type SellerApplicationOption } from "@/lib/packaging";

export function PackagingWorkflowBoard({
  title,
  description,
  records,
  assetOptions = [],
  sellerOptions = [],
}: Readonly<{
  title: string;
  description: string;
  records: PackagingRecord[];
  assetOptions?: import("@/lib/asset-registry").AssetRegistryRecord[];
  sellerOptions?: SellerApplicationOption[];
}>) {
  const grouped = records.reduce<Record<PackagingStatus, PackagingRecord[]>>(
    (acc, record) => {
      acc[record.status].push(record);
      return acc;
    },
    {
      incomplete: [],
      draft_ready: [],
      approved_for_listing: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Workflow" title={title} description={description} />
      {records.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {(Object.keys(packagingStatusLabels) as PackagingStatus[]).map((status) => (
            <div key={status} className="rounded-[1.5rem] border border-ink-200 bg-ink-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">
                  {packagingStatusLabels[status]}
                </h3>
                <span className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700">
                  {grouped[status].length}
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                {grouped[status].map((record) => (
                  <PackagingCard
                    key={record.id}
                    record={record}
                    editable
                    assetOptions={assetOptions}
                    sellerOptions={sellerOptions}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
          No packaging records are loaded yet. Once rows exist in Supabase, the workflow columns
          will appear here automatically.
        </div>
      )}
    </section>
  );
}
