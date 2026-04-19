import { AdminPageHeader } from "@/components/admin-page-header";
import { AssetIntakeCard } from "@/components/asset-intake-card";
import { AssetIntakeSummary } from "@/components/asset-intake-summary";
import { AssetRegistryTable } from "@/components/asset-registry-table";
import { AssetStatusBoard } from "@/components/asset-status-board";
import { SectionHeading } from "@/components/section-heading";
import {
  assetIntakeRecords,
  assetRegistryRecords,
} from "@/lib/asset-registry";

export default function AssetDraftsPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="AI Asset Drafts"
        description="Internal intake and registry shell for new AI tools and digital assets before they enter the build pipeline."
      />
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <AssetIntakeCard record={assetIntakeRecords[0]} />
        <AssetIntakeSummary records={assetIntakeRecords} />
      </div>

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
