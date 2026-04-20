import { AdminPageHeader } from "@/components/admin-page-header";
import { PackagingCard } from "@/components/packaging-card";
import { PackagingFormFields } from "@/components/packaging-form-fields";
import { PackagingReadinessSummary } from "@/components/packaging-readiness-summary";
import { PackagingWorkflowBoard } from "@/components/packaging-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { createPackagingRecord, getPackagingRecords, getSellerApplicationOptions } from "@/lib/packaging";
import { getAssetRegistryRecords } from "@/lib/asset-registry";

type PackagingPageProps = Readonly<{
  searchParams?: {
    error?: string;
    saved?: string;
  };
}>;

export default async function PackagingPage({ searchParams }: PackagingPageProps) {
  const [packagingRecords, assetRegistryRecords] = await Promise.all([
    getPackagingRecords(),
    getAssetRegistryRecords(),
  ]);
  const sellerOptions = await getSellerApplicationOptions();
  const hasAssets = assetRegistryRecords.length > 0;
  const usedAssetIds = new Set(packagingRecords.map((record) => record.asset_registry_id));
  const availableAssetOptions = assetRegistryRecords.filter((asset) => !usedAssetIds.has(asset.id));

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Packaging Center"
        description="The shell for preparing assets for sale with consistent presentation and transfer readiness."
      />
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Packaging record {searchParams.saved === "created" ? "created" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="New Packaging Record"
          title="Prepare an asset for listing"
          description="Link a packaging record to an asset, then capture the pitch, summary, visuals, support scope, and transfer checklist."
        />
        {hasAssets && availableAssetOptions.length > 0 ? (
          <form action={createPackagingRecord} className="grid gap-5">
            <PackagingFormFields
              assetOptions={availableAssetOptions}
              sellerOptions={sellerOptions}
              submitLabel="Create packaging"
            />
          </form>
        ) : hasAssets ? (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            All available assets already have packaging records. Create a new asset first or edit an
            existing packaging record.
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            No asset registry rows are available yet. Create an asset first so a packaging record
            can be linked to it.
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {packagingRecords[0] ? (
          <PackagingCard record={packagingRecords[0]} assetOptions={assetRegistryRecords} />
        ) : (
          <section className="grid gap-4 rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 p-6 text-sm leading-6 text-ink-600">
            <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
              Packaging Queue
            </div>
            <div className="text-xl font-semibold text-ink-950">No packaging rows yet</div>
            <p>
              Add records to the Supabase <code>asset_packaging</code> table to populate this shell
              with listing prep details.
            </p>
          </section>
        )}
        <PackagingReadinessSummary records={packagingRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Packaging Overview"
          title="Listing prep focused on speed and clarity"
          description="Each asset needs a clear pitch, description, summary, visuals, support scope, and transfer checklist before it can move forward."
        />
        {packagingRecords.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {packagingRecords.map((record) => (
              <PackagingCard
                key={record.id}
                record={record}
                editable
                assetOptions={assetRegistryRecords}
                sellerOptions={sellerOptions}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            No packaging records are loaded yet. Once rows exist in Supabase, the packaging cards
            will appear here automatically.
          </div>
        )}
      </section>

      <PackagingWorkflowBoard
        title="Internal listing-prep workflow"
        description="Organized by readiness state so Allura can see what is incomplete, draft ready, or approved for listing."
        records={packagingRecords}
        assetOptions={assetRegistryRecords}
        sellerOptions={sellerOptions}
      />
    </div>
  );
}
