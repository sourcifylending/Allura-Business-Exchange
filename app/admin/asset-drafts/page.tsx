import { AdminPageHeader } from "@/components/admin-page-header";
import { AssetIntakeCard } from "@/components/asset-intake-card";
import { AssetIntakeSummary } from "@/components/asset-intake-summary";
import { AssetRegistryFormFields } from "@/components/asset-registry-form-fields";
import { AssetRegistryTable } from "@/components/asset-registry-table";
import { AssetStatusBoard } from "@/components/asset-status-board";
import { SectionHeading } from "@/components/section-heading";
import { assetIntakeRecords, createAssetRegistryRecord, getAssetRegistryRecords } from "@/lib/asset-registry";

type AssetDraftsPageProps = Readonly<{
  searchParams?: {
    error?: string;
    saved?: string;
  };
}>;

export default async function AssetDraftsPage({ searchParams }: AssetDraftsPageProps) {
  const assetRegistryRecords = await getAssetRegistryRecords();

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="AI Asset Drafts"
        description="Internal intake and registry shell for new AI tools and digital assets before they enter the build pipeline."
      />
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Asset registry entry {searchParams.saved === "created" ? "created" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <AssetIntakeCard record={assetIntakeRecords[0]} />
        <AssetIntakeSummary records={assetIntakeRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="New Asset"
          title="Capture a build-ready asset"
          description="Add the core registry details now so the asset can move through build, packaging, listing, and transfer without rework later."
        />
        <form action={createAssetRegistryRecord} className="grid gap-5">
          <AssetRegistryFormFields submitLabel="Create asset" />
        </form>
      </section>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="New Asset Intake"
          title="Capture the build-ready details early"
          description="This shell is structured so a future New Asset action can create a record, assign a slug, and move the asset into the build pipeline."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {assetIntakeRecords.map((record) => (
            <AssetIntakeCard key={record.id} record={record} />
          ))}
        </div>
      </section>

      <AssetStatusBoard
        title="Internal asset workflow"
        description="Grouped by stage so Allura can see what is at idea, research, build, packaging, ready-to-list, or listed state."
        records={assetIntakeRecords}
      />

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Asset Registry"
          title="Registry view of existing assets"
          description="A simple, organized registry shell for asset_id, slug, paths, URLs, readiness, and transfer state."
        />
        <AssetRegistryTable records={assetRegistryRecords} />
      </section>
    </div>
  );
}
